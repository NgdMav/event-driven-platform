package com.mav.recommendationservice.api.dto;

import java.util.List;

public record ExerciseRecommendationResult(
        List<String> exerciseSlugs,
        String reason
) {
}
