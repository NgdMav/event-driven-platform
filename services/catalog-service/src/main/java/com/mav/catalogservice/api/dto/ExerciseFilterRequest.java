package com.mav.catalogservice.api.dto;

import com.mav.catalogservice.domain.Difficulty;
import com.mav.catalogservice.domain.Equipment;
import com.mav.catalogservice.domain.MuscleGroup;

public record ExerciseFilterRequest(
        MuscleGroup primaryMuscleGroup,
        Difficulty difficulty,
        Equipment equipment,
        String search,
        Boolean isActive
) {
}
