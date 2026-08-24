package com.mav.workoutservice.api.dto;

import java.util.List;

public record RecommendationRequest(
        String goal,
        String experienceLevel,
        Integer daysPerWeek,
        List<String> availableEquipment,
        String activityLevel,
        Double currentWeightKg,
        Double heightCm
) {
}
