package com.mav.workoutservice.application.recommendation;

import java.util.UUID;

public record ProgramRecommendationRequest(
        UUID userId,
        String goal,
        String experienceLevel,
        Integer daysPerWeek,
        String activityLevel
) {
}
