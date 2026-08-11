package com.mav.authservice.integration.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserRegisteredEvent(
        UUID eventId,
        String eventType,
        Instant occurredAt,
        String producer,
        Payload payload
) {
    public record Payload(
            UUID userId,
            String email,
            Instant createdAt
    ) {
    }
}
