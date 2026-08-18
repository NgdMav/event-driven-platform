package com.mav.recommendationservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "recommendation_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationLog {
    
    @Id
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "recommendation_type", nullable = false)
    private String recommendationType;
    
    @Column(name = "request_payload", nullable = false, columnDefinition = "jsonb")
    private String requestPayload;
    
    @Column(name = "response_payload", nullable = false, columnDefinition = "jsonb")
    private String responsePayload;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }
}