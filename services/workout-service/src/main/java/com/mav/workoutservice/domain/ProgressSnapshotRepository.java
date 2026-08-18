package com.mav.workoutservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgressSnapshotRepository extends JpaRepository<ProgressSnapshot, UUID> {
    Optional<ProgressSnapshot> findByUserIdAndSnapshotDate(UUID userId, LocalDate date);
    
    List<ProgressSnapshot> findTop7ByUserIdOrderBySnapshotDateDesc(UUID userId);
    
    @Query("SELECT COALESCE(SUM(p.totalSessions), 0) " +
            "FROM ProgressSnapshot p " +
            "WHERE p.userId = :userId")
    Integer sumTotalSessionsByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT COALESCE(SUM(p.totalVolumeKg), 0) " +
            "FROM ProgressSnapshot p " +
            "WHERE p.userId = :userId")
    BigDecimal sumTotalVolumeByUserId(@Param("userId") UUID userId);
}