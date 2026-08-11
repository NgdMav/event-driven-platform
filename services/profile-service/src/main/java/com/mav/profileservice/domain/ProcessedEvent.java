package com.mav.profileservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "processed_event")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessedEvent {
    
    @Id
    private UUID eventId;
    
    @Column(name = "event_type", nullable = false)
    private String eventType;
    
    @Column(name = "processed_at", nullable = false)
    private Instant processedAt;
    
    @PrePersist
    public void prePersist() {
        processedAt = Instant.now();
    }
}