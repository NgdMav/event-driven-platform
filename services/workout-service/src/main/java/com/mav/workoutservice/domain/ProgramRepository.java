package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgramRepository extends JpaRepository<Program, UUID> {
    
    @Query("SELECT DISTINCT p FROM Program p " +
            "LEFT JOIN FETCH p.workoutDays wd " +
            "LEFT JOIN FETCH wd.exercises " +
            "WHERE p.userId = :userId ORDER BY p.createdAt DESC")
    List<Program> findWithDetailsByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT p FROM Program p " +
            "LEFT JOIN FETCH p.workoutDays wd " +
            "LEFT JOIN FETCH wd.exercises " +
            "WHERE p.id = :programId")
    Optional<Program> findWithDetailsById(@Param("programId") UUID programId);
    
    List<Program> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Program> findByUserIdAndStatus(UUID userId, ProgramStatus status);
}