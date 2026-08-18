package com.mav.workoutservice.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProgressSummaryDto(
        UUID userId,
        Integer totalSessions,
        BigDecimal totalVolumeKg,
        List<ProgressSnapshotDto> recentSnapshots
) {
}
