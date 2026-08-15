package com.mav.workoutservice.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProgramResponse(
        UUID id,
        UUID userId,
        String name,
        String goal,
        Integer durationWeeks,
        Integer daysPerWeek,
        String status,
        String source,
        List<WorkoutDayResponse> workoutDays,
        Instant createdAt
) {
    public record WorkoutDayResponse(
            UUID id,
            Integer dayIndex,
            String title,
            String focus,
            List<WorkoutExerciseResponse> exercises
    ) {
    }
    
    public record WorkoutExerciseResponse(
            UUID id,
            UUID exerciseId,
            Integer position,
            Integer sets,
            Integer repsMin,
            Integer repsMax,
            Integer restSeconds
    ) {
    }
}
