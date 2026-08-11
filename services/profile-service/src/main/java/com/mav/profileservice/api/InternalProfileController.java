package com.mav.profileservice.api;

import com.mav.profileservice.api.dto.ProfileDto;
import com.mav.profileservice.application.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@RestController
@RequestMapping("/internal/profiles")
@RequiredArgsConstructor
public class InternalProfileController {

    private final ProfileService profileService;
    
    @GetMapping("/{userId}")
    public ProfileDto getProfile(@PathVariable UUID userId) {
        return profileService.getMe(userId);
    }
}
