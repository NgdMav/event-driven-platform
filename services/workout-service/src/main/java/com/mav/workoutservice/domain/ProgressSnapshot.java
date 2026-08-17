package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "progress_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressSnapshot {
    
    @Id
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "snapshot_date", nullable = false)
    private LocalDate snapshotDate;
    
    @Column(name = "total_sessions", nullable = false)
    private Integer totalSessions;
    
    @Column(name = "total_volume_kg", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalVolumeKg;
    
    @Column(name = "completed_sessions", nullable = false)
    private Integer completedSessions;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}