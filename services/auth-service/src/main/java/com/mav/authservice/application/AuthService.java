package com.mav.authservice.application;

import com.mav.authservice.api.dto.AuthResponse;
import com.mav.authservice.api.dto.LoginRequest;
import com.mav.authservice.api.dto.RefreshRequest;
import com.mav.authservice.api.dto.RegisterRequest;
import com.mav.authservice.domain.*;
import com.mav.authservice.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    private final AuthEventPublisher authEventPublisher;
    
    @Value("${auth.refresh-token-ttl-days}")
    private long refreshTokenTtlDays;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase(Locale.ROOT);
        
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        
        User user = User.builder()
                .id(UUID.randomUUID())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .status(UserStatus.ACTIVE)
                .build();
        
        userRepository.save(user);
        
        authEventPublisher.publishUserRegistered(user);
        
        return issueTokens(user);
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase(Locale.ROOT);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid credentials"
                ));
        
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        
        return issueTokens(user);
    }
    
    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        String tokenHash = TokenHashUtil.sha256(request.refreshToken());
        
        RefreshToken refreshToken = refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid refresh token"
                ));
        
        if (refreshToken.isExpired()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }
        
        refreshToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(refreshToken);
        
        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User not found"
                ));
        
        return issueTokens(user);
    }
    
    @Transactional
    public void logout(RefreshRequest request) {
        String tokenHash = TokenHashUtil.sha256(request.refreshToken());
        
        refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(tokenHash)
                .ifPresent(token -> {
                    token.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(token);
                });
    }
    
    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.createAccessToken(user);
        
        refreshTokenRepository.revokeAllActiveByUserId(user.getId(), Instant.now());
        
        String refreshTokenValue = UUID.randomUUID().toString();
        String refreshTokenHash = TokenHashUtil.sha256(refreshTokenValue);
        
        RefreshToken refreshToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .userId(user.getId())
                .tokenHash(refreshTokenHash)
                .expiresAt(Instant.now().plus(refreshTokenTtlDays, ChronoUnit.DAYS))
                .build();
        
        refreshTokenRepository.save(refreshToken);
        
        return new AuthResponse(
                accessToken,
                refreshTokenValue,
                jwtService.getAccessTokenTtlSeconds()
        );
    }
}
