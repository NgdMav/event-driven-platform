package com.mav.workoutservice.integration.event;

import java.time.Instant;
import java.util.UUID;

public record WorkoutSessionCompletedEvent(
        UUID eventId,
        String eventType,
        Instant occurredAt,
        String producer,
        Payload payload
) {
    public record Payload(
            UUID userId,
            UUID sessionId,
            UUID programId,
            Long durationMinutes,
            Integer totalSets,
            Integer completedSets
    ) {
    }
}
