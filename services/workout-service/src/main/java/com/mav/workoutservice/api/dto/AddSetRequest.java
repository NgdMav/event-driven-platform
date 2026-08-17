package com.mav.workoutservice.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record AddSetRequest(
        @NotNull
        UUID exerciseId,
        @Min(1)
        Integer setNumber,
        Integer reps,
        BigDecimal weightKg,
        Integer difficultyRating,
        Boolean completed
) {
}
