package com.mav.catalogservice.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {
    
    @Id
    private UUID id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String slug;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String technique;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;
    
    @Enumerated(EnumType.STRING)
    private Equipment equipment;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "primary_muscle_group", nullable = false)
    private MuscleGroup primaryMuscleGroup;
    
    @ElementCollection
    @CollectionTable(name = "exercise_secondary_muscles",
            joinColumns = @JoinColumn(name = "exercise_id"))
    @Column(name = "muscle_group")
    @Enumerated(EnumType.STRING)
    private List<MuscleGroup> secondaryMuscleGroups;
    
    @Column(name = "video_url")
    private String videoUrl;
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (isActive == null) {
            isActive = true;
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}