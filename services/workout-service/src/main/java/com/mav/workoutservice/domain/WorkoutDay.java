package com.mav.workoutservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "workout_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutDay {
    
    @Id
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @Column(name = "day_index", nullable = false)
    private Integer dayIndex;
    
    private String title;
    
    private String focus;
    
    @OneToMany(mappedBy = "workoutDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position")
    @Builder.Default
    private Set<WorkoutExercise> exercises = new LinkedHashSet<>();
}