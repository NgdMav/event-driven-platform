package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "set_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetLog {
    
    @Id
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TrainingSession session;
    
    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;
    
    @Column(name = "set_number", nullable = false)
    private Integer setNumber;
    
    private Integer reps;
    
    @Column(name = "weight_kg")
    private BigDecimal weightKg;
    
    @Column(name = "difficulty_rating")
    private Integer difficultyRating;
    
    @Column(nullable = false)
    private Boolean completed;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
        if (completed == null) completed = false;
    }
}