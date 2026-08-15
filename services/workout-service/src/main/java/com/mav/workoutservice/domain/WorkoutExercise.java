package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {
    
    @Id
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id", nullable = false)
    private WorkoutDay workoutDay;
    
    @Column(name = "exercise_id", nullable = false)
    private UUID exerciseId;
    
    @Column(nullable = false)
    private Integer position;
    
    @Column(nullable = false)
    private Integer sets;
    
    @Column(name = "reps_min", nullable = false)
    private Integer repsMin;
    
    @Column(name = "reps_max")
    private Integer repsMax;
    
    @Column(name = "rest_seconds")
    private Integer restSeconds;
    
    @Column(name = "target_weight_kg")
    private BigDecimal targetWeightKg;
    
    private String notes;
}