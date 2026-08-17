package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface ProgressSnapshotRepository extends JpaRepository<ProgressSnapshot, UUID> {
    Optional<ProgressSnapshot> findByUserIdAndSnapshotDate(UUID userId, LocalDate date);
}