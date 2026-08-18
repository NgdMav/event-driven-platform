package com.mav.recommendationservice.api.dto;

import java.util.UUID;

public record ProgramRecommendationRequest(
        UUID userId,
        String goal,
        String experienceLevel,
        Integer daysPerWeek,
        String activityLevel
) {
}
