package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "training_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingSession {

    @Id
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "program_id")
    private UUID programId;
    
    @Column(name = "workout_day_id")
    private UUID workoutDayId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SessionStatus status = SessionStatus.PLANNED;
    
    @Column(name = "started_at")
    private Instant startedAt;
    
    @Column(name = "completed_at")
    private Instant completedAt;
    
    private String notes;
    
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SetLog> setLogs = new ArrayList<>();
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) status = SessionStatus.PLANNED;
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
    
    // Domain rules
    public void start() {
        if (this.status != SessionStatus.PLANNED) {
            throw new IllegalStateException("Session can only be started from PLANNED status");
        }
        this.status = SessionStatus.IN_PROGRESS;
        this.startedAt = Instant.now();
    }
    
    public void complete() {
        if (this.status != SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Session can only be completed from IN_PROGRESS status");
        }
        this.status = SessionStatus.COMPLETED;
        this.completedAt = Instant.now();
    }
    
    public void addSetLog(SetLog setLog) {
        if (this.status != SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot add sets to a session that is not in progress");
        }
        setLog.setSession(this);
        this.setLogs.add(setLog);
    }
}