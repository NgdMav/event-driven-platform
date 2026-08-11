package com.mav.profileservice.api;

import com.mav.profileservice.api.dto.ProfileDto;
import com.mav.profileservice.api.dto.UpdateProfileRequest;
import com.mav.profileservice.application.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final ProfileService profileService;
    
    @GetMapping("/me")
    public ProfileDto getMe(Authentication authentication) {
        UUID userId = getUserId(authentication);
        return profileService.getMe(userId);
    }
    
    @PutMapping("/me")
    public ProfileDto updateMe(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        UUID userId = getUserId(authentication);
        return profileService.updateMe(userId, request);
    }
    
    private UUID getUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
