package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProgramRepository extends JpaRepository<Program, UUID> {
    List<Program> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Program> findByUserIdAndStatus(UUID userId, ProgramStatus status);
}