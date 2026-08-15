package com.mav.catalogservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<Exercise, UUID>,
                                            JpaSpecificationExecutor<Exercise> {
    
    Optional<Exercise> findBySlug(String slug);
    
    List<Exercise> findByPrimaryMuscleGroupAndIsActive(MuscleGroup muscleGroup, Boolean isActive);
    
    List<Exercise> findByDifficultyAndIsActive(Difficulty difficulty, Boolean isActive);
    
    List<Exercise> findByEquipmentAndIsActive(Equipment equipment, Boolean isActive);
    
    @Query("SELECT e FROM Exercise e WHERE e.isActive = true AND " +
            "(LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Exercise> searchByNameOrDescription(@Param("search") String search);
    
    List<Exercise> findByIsActive(Boolean isActive);
}