package com.mav.workoutservice.api.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SessionResponse(
        UUID id,
        UUID userId,
        UUID programId,
        UUID workoutDayId,
        String status,
        Instant startedAt,
        Instant completedAt,
        List<SetLogResponse> setLogs
) {
    public record SetLogResponse(
            UUID id,
            UUID exerciseId,
            Integer setNumber,
            Integer reps,
            java.math.BigDecimal weightKg,
            Boolean completed
    ) {
    }
}
