package com.mav.profileservice.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateProfileRequest(
        
        @Size(max = 100)
        String firstName,
        
        @Size(max = 100)
        String lastName,
        
        LocalDate birthDate,
        
        @Size(max = 20)
        String sex,
        
        @DecimalMin(value = "0.0", message = "height must be positive")
        BigDecimal heightCm,
        
        @DecimalMin(value = "0.0", message = "weight must be positive")
        BigDecimal weightKg,
        
        @Size(max = 50)
        String goal,
        
        @Size(max = 50)
        String experienceLevel,
        
        @Size(max = 50)
        String activityLevel,
        
        @Size(max = 100)
        String timezone,
        
        @Size(max = 20)
        String privacyLevel
) {
}
