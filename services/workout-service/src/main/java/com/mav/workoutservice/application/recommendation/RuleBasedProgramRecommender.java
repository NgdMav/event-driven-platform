package com.mav.workoutservice.application.recommendation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class RuleBasedProgramRecommender implements ProgramRecommendationPort {
    
    @Override
    public ProgramRecommendationResult recommend(ProgramRecommendationRequest request) {
        log.info("Using rule-based recommendation for user {}", request.userId());
        
        int days = request.daysPerWeek() != null ? request.daysPerWeek() : 3;
        
        return switch (days) {
            case 2 -> buildFullBody(request, 2);
            case 4 -> buildUpperLower(request);
            default -> buildFullBody(request, 3);
        };
    }
    
    private ProgramRecommendationResult buildFullBody(
            ProgramRecommendationRequest request, int days) {
        List<ProgramRecommendationResult.DayTemplate> dayTemplates = new java.util.ArrayList<>();
        
        for (int i = 1; i <= days; i++) {
            dayTemplates.add(new ProgramRecommendationResult.DayTemplate(
                    i,
                    "Full Body Day " + i,
                    "FULL_BODY",
                    List.of(
                            new ProgramRecommendationResult.ExerciseTemplate(
                                    "barbell-squat", 3, 8, 12, 90),
                            new ProgramRecommendationResult.ExerciseTemplate(
                                    "bench-press", 3, 8, 12, 90),
                            new ProgramRecommendationResult.ExerciseTemplate(
                                    "barbell-row", 3, 8, 12, 90),
                            new ProgramRecommendationResult.ExerciseTemplate(
                                    "overhead-press", 3, 10, 12, 60),
                            new ProgramRecommendationResult.ExerciseTemplate(
                                    "crunches", 3, 15, 20, 45)
                    )
            ));
        }
        
        return new ProgramRecommendationResult(
                "FULL_BODY_" + days + "_DAYS",
                "Full Body Program",
                8,
                days,
                dayTemplates
        );
    }
    
    private ProgramRecommendationResult buildUpperLower(
            ProgramRecommendationRequest request) {
        return new ProgramRecommendationResult(
                "UPPER_LOWER_4_DAYS",
                "Upper/Lower Split",
                8,
                4,
                List.of(
                        new ProgramRecommendationResult.DayTemplate(
                                1, "Upper Body A", "UPPER",
                                List.of(
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "bench-press", 4, 6, 10, 120),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "barbell-row", 4, 6, 10, 120),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "overhead-press", 3, 8, 12, 90),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "barbell-curl", 3, 10, 12, 60)
                                )),
                        new ProgramRecommendationResult.DayTemplate(
                                2, "Lower Body A", "LOWER",
                                List.of(
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "barbell-squat", 4, 6, 10, 120),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "deadlift", 3, 5, 8, 180),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "crunches", 3, 15, 20, 45)
                                )),
                        new ProgramRecommendationResult.DayTemplate(
                                3, "Upper Body B", "UPPER",
                                List.of(
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "dumbbell-bench-press", 4, 8, 12, 90),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "pull-ups", 4, 6, 10, 120),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "lying-triceps-extension", 3, 10, 12, 60)
                                )),
                        new ProgramRecommendationResult.DayTemplate(
                                4, "Lower Body B", "LOWER",
                                List.of(
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "deadlift", 4, 5, 8, 180),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "barbell-squat", 3, 8, 12, 120),
                                        new ProgramRecommendationResult.ExerciseTemplate(
                                                "crunches", 3, 15, 20, 45)
                                ))
                )
        );
    }
}
