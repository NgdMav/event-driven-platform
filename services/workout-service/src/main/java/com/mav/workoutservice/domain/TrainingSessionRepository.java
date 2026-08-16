package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, UUID> {
    List<TrainingSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<TrainingSession> findByUserIdAndStatus(UUID userId, SessionStatus status);
    @Query("""
        select s from TrainingSession s
        left join fetch s.setLogs
        where s.id = :id
    """)
    Optional<TrainingSession> findWithSetLogsById(@Param("id") UUID id);
}