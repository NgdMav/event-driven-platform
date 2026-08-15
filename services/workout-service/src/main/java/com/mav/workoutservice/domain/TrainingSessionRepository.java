package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {
    List<TrainingSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<TrainingSession> findByUserIdAndStatus(UUID userId, SessionStatus status);
}