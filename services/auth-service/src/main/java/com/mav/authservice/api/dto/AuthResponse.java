package com.mav.authservice.api.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        long expiresIn
) {
}
