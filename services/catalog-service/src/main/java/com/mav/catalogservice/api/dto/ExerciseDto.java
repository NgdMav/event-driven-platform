package com.mav.catalogservice.api.dto;

import com.mav.catalogservice.domain.Difficulty;
import com.mav.catalogservice.domain.Equipment;
import com.mav.catalogservice.domain.Exercise;
import com.mav.catalogservice.domain.MuscleGroup;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ExerciseDto(
        UUID id,
        String name,
        String slug,
        String description,
        String technique,
        Difficulty difficulty,
        Equipment equipment,
        MuscleGroup primaryMuscleGroup,
        List<MuscleGroup> secondaryMuscleGroups,
        String videoUrl,
        String thumbnailUrl,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {
    public static ExerciseDto from(Exercise exercise) {
        return new ExerciseDto(
                exercise.getId(),
                exercise.getName(),
                exercise.getSlug(),
                exercise.getDescription(),
                exercise.getTechnique(),
                exercise.getDifficulty(),
                exercise.getEquipment(),
                exercise.getPrimaryMuscleGroup(),
                exercise.getSecondaryMuscleGroups(),
                exercise.getVideoUrl(),
                exercise.getThumbnailUrl(),
                exercise.getIsActive(),
                exercise.getCreatedAt(),
                exercise.getUpdatedAt()
        );
    }
}
