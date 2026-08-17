package com.mav.workoutservice.application.recommendation;

import java.util.List;

public record ProgramRecommendationResult(
        String programTemplate,
        String name,
        Integer durationWeeks,
        Integer daysPerWeek,
        List<DayTemplate> days
) {
    public record DayTemplate(
            Integer dayIndex,
            String title,
            String focus,
            List<ExerciseTemplate> exercises
    ) {
    }
    
    public record ExerciseTemplate(
            String exerciseSlug,
            Integer sets,
            Integer repsMin,
            Integer repsMax,
            Integer restSeconds
    ) {
    }
}
