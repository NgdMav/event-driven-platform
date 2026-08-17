package com.mav.workoutservice.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record GenerateProgramRequest(
        @Size(max = 50)
        String goal,
        @Size(max = 50)
        String experienceLevel,
        @Min(1) @Max(7)
        Integer daysPerWeek,
        @Size(max = 50)
        String activityLevel
) {
}
