package com.mav.workoutservice.api.dto;

import com.mav.workoutservice.domain.ProgressSnapshot;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ProgressSnapshotDto(
        UUID id,
        LocalDate snapshotDate,
        Integer totalSessions,
        BigDecimal totalVolumeKg,
        Integer completedSessions,
        Integer avgSessionDurationMinutes
) {
    public static ProgressSnapshotDto from(ProgressSnapshot s) {
        return new ProgressSnapshotDto(
                s.getId(),
                s.getSnapshotDate(),
                s.getTotalSessions(),
                s.getTotalVolumeKg(),
                s.getCompletedSessions(),
                s.getAvgSessionDurationMinutes()
        );
    }
}
