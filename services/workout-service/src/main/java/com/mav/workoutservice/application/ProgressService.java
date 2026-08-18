package com.mav.workoutservice.application;

import com.mav.workoutservice.api.dto.ProgressSnapshotDto;
import com.mav.workoutservice.api.dto.ProgressSummaryDto;
import com.mav.workoutservice.domain.ProgressSnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgressService {
    
    private final ProgressSnapshotRepository snapshotRepository;
    
    @Transactional(readOnly = true)
    public ProgressSummaryDto getSummary(UUID userId) {
        Integer totalSessions = snapshotRepository.sumTotalSessionsByUserId(userId);
        var totalVolume = snapshotRepository.sumTotalVolumeByUserId(userId);
        var recent = snapshotRepository.findTop7ByUserIdOrderBySnapshotDateDesc(userId)
                .stream().map(ProgressSnapshotDto::from).toList();
        
        return new ProgressSummaryDto(userId, totalSessions, totalVolume, recent);
    }
}
