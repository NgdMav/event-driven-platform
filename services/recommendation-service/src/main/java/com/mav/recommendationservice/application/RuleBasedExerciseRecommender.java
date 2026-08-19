package com.mav.recommendationservice.application;

import com.mav.recommendationservice.api.dto.ExerciseRecommendationRequest;
import com.mav.recommendationservice.api.dto.ExerciseRecommendationResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RuleBasedExerciseRecommender {
    
    public ExerciseRecommendationResult recommend(ExerciseRecommendationRequest req) {
        // Простая заглушка: возвращаем слаг-и в зависимости от целевой мышцы
        String target = req.targetMuscleGroup() != null ? req.targetMuscleGroup().toUpperCase() : "CHEST";
        
        List<String> slugs = switch (target) {
            case "BACK" -> List.of("pull-ups", "barbell-row", "deadlift");
            case "LEGS" -> List.of("barbell-squat", "deadlift");
            case "SHOULDERS" -> List.of("overhead-press");
            default -> List.of("bench-press", "dumbbell-bench-press");
        };
        
        int limit = req.limit() != null ? req.limit() : 3;
        return new ExerciseRecommendationResult(slugs.stream().limit(limit).toList(), "Rule-based match for " + target);
    }
}
