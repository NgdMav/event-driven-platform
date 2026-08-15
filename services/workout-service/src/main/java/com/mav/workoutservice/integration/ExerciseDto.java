package com.mav.workoutservice.integration;

import java.util.UUID;

public record ExerciseDto(
        UUID id,
        String name,
        String slug,
        String difficulty,
        String equipment,
        String primaryMuscleGroup
) {
}
