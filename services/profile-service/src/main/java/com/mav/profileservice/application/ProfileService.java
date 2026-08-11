package com.mav.profileservice.application;

import com.mav.profileservice.api.dto.ProfileDto;
import com.mav.profileservice.api.dto.UpdateProfileRequest;
import com.mav.profileservice.domain.Profile;
import com.mav.profileservice.domain.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
class ProfileService {
    
    private final ProfileRepository profileRepository;
    
    @Transactional
    public Profile ensureProfileExists(UUID userId) {
        return profileRepository.findById(userId)
                .orElseGet(() -> {
                    Profile profile = Profile.builder()
                            .userId(userId)
                            .privacyLevel("PRIVATE")
                            .build();
                    
                    return profileRepository.save(profile);
                });
    }
    
    @Transactional
    public ProfileDto getMe(UUID userId) {
        Profile profile = ensureProfileExists(userId);
        return ProfileDto.from(profile);
    }
    
    @Transactional
    public ProfileDto updateMe(UUID userId, UpdateProfileRequest request) {
        Profile profile = ensureProfileExists(userId);
        
        if (request.firstName() != null) {
            profile.setFirstName(request.firstName());
        }
        
        if (request.lastName() != null) {
            profile.setLastName(request.lastName());
        }
        
        if (request.birthDate() != null) {
            profile.setBirthDate(request.birthDate());
        }
        
        if (request.sex() != null) {
            profile.setSex(request.sex());
        }
        
        if (request.heightCm() != null) {
            profile.setHeightCm(request.heightCm());
        }
        
        if (request.weightKg() != null) {
            profile.setWeightKg(request.weightKg());
        }
        
        if (request.goal() != null) {
            profile.setGoal(request.goal());
        }
        
        if (request.experienceLevel() != null) {
            profile.setExperienceLevel(request.experienceLevel());
        }
        
        if (request.activityLevel() != null) {
            profile.setActivityLevel(request.activityLevel());
        }
        
        if (request.timezone() != null) {
            profile.setTimezone(request.timezone());
        }
        
        if (request.privacyLevel() != null) {
            profile.setPrivacyLevel(request.privacyLevel());
        }
        
        profileRepository.save(profile);
        
        return ProfileDto.from(profile);
    }
}
