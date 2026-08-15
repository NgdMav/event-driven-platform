package com.mav.workoutservice.api.dto;

import java.util.UUID;

public record StartSessionRequest(
        UUID programId,
        UUID workoutDayId
) {
}
