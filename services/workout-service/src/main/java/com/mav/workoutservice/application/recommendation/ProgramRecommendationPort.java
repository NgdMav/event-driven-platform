package com.mav.workoutservice.application.recommendation;

public interface ProgramRecommendationPort {
    ProgramRecommendationResult recommend(ProgramRecommendationRequest request);
}
