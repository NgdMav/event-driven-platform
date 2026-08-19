package com.mav.recommendationservice.application;

import com.mav.recommendationservice.api.dto.ProgramRecommendationRequest;
import com.mav.recommendationservice.api.dto.ProgramRecommendationResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RuleBasedProgramRecommender {
    
    public ProgramRecommendationResult recommend(ProgramRecommendationRequest req) {
        int days = req.daysPerWeek() != null ? req.daysPerWeek() : 3;
        
        if (days >= 4) return buildUpperLower();
        return buildFullBody(days);
    }
    
    private ProgramRecommendationResult buildFullBody(int days) {
        List<ProgramRecommendationResult.DayTemplate> dayTemplates = new java.util.ArrayList<>();
        for (int i = 1; i <= days; i++) {
            dayTemplates.add(new ProgramRecommendationResult.DayTemplate(i, "Full Body Day " + i, "FULL_BODY", List.of(
                    new ProgramRecommendationResult.ExerciseTemplate("barbell-squat", 3, 8, 12, 90),
                    new ProgramRecommendationResult.ExerciseTemplate("bench-press", 3, 8, 12, 90),
                    new ProgramRecommendationResult.ExerciseTemplate("barbell-row", 3, 8, 12, 90),
                    new ProgramRecommendationResult.ExerciseTemplate("crunches", 3, 15, 20, 45)
            )));
        }
        return new ProgramRecommendationResult("FULL_BODY_" + days, "Full Body Program", 8, days, dayTemplates);
    }
    
    private ProgramRecommendationResult buildUpperLower() {
        return new ProgramRecommendationResult("UPPER_LOWER_4", "Upper/Lower Split", 8, 4, List.of(
                new ProgramRecommendationResult.DayTemplate(1, "Upper A", "UPPER", List.of(new ProgramRecommendationResult.ExerciseTemplate("bench-press", 4, 6, 10, 120), new ProgramRecommendationResult.ExerciseTemplate("barbell-row", 4, 6, 10, 120))),
                new ProgramRecommendationResult.DayTemplate(2, "Lower A", "LOWER", List.of(new ProgramRecommendationResult.ExerciseTemplate("barbell-squat", 4, 6, 10, 120), new ProgramRecommendationResult.ExerciseTemplate("deadlift", 3, 5, 8, 180))),
                new ProgramRecommendationResult.DayTemplate(3, "Upper B", "UPPER", List.of(new ProgramRecommendationResult.ExerciseTemplate("pull-ups", 4, 6, 10, 120), new ProgramRecommendationResult.ExerciseTemplate("overhead-press", 3, 8, 12, 90))),
                new ProgramRecommendationResult.DayTemplate(4, "Lower B", "LOWER", List.of(new ProgramRecommendationResult.ExerciseTemplate("deadlift", 4, 5, 8, 180), new ProgramRecommendationResult.ExerciseTemplate("barbell-squat", 3, 8, 12, 120)))
        ));
    }
}
