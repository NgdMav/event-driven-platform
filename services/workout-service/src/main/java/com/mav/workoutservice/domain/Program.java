package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program {
    
    @Id
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(nullable = false)
    private String name;
    
    private String goal;
    
    @Column(name = "duration_weeks")
    private Integer durationWeeks;
    
    @Column(name = "days_per_week")
    private Integer daysPerWeek;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgramStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgramSource source;
    
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dayIndex")
    @Builder.Default
    private Set<WorkoutDay> workoutDays = new LinkedHashSet<>();
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) status = ProgramStatus.DRAFT;
        if (source == null) source = ProgramSource.RULE_BASED;
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
    
    // Domain rules
    public void activate() {
        if (this.status == ProgramStatus.ACTIVE) {
            throw new IllegalStateException("Program is already active");
        }
        this.status = ProgramStatus.ACTIVE;
    }
}