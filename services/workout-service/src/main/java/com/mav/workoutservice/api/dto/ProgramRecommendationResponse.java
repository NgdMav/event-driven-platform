package com.mav.workoutservice.api.dto;

import java.util.List;

public record ProgramRecommendationResponse(
        String programTemplateId,
        String name,
        double confidence,
        List<String> reasons,
        List<String> suggestedFocus
) {
}
