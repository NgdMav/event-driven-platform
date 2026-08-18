package com.mav.recommendationservice.api.dto;

import java.util.UUID;

public record ExerciseRecommendationRequest(
        UUID userId,
        String targetMuscleGroup,
        String equipment,
        Integer limit
) {
}
