package com.mav.profileservice.api.dto;

import com.mav.profileservice.domain.Profile;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ProfileDto(
        UUID userId,
        String firstName,
        String lastName,
        LocalDate birthDate,
        String sex,
        BigDecimal heightCm,
        BigDecimal weightKg,
        String goal,
        String experienceLevel,
        String activityLevel,
        String timezone,
        String privacyLevel,
        Instant createdAt,
        Instant updatedAt
) {
    
    public static ProfileDto from(Profile profile) {
        return new ProfileDto(
                profile.getUserId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getBirthDate(),
                profile.getSex(),
                profile.getHeightCm(),
                profile.getWeightKg(),
                profile.getGoal(),
                profile.getExperienceLevel(),
                profile.getActivityLevel(),
                profile.getTimezone(),
                profile.getPrivacyLevel(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
