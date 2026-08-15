package com.mav.workoutservice.application;

import com.mav.workoutservice.domain.TrainingSession;
import com.mav.workoutservice.domain.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StartSessionUseCase {
    
    private final TrainingSessionRepository sessionRepository;
    
    @Transactional
    public TrainingSession execute(UUID userId, UUID programId, UUID workoutDayId) {
        TrainingSession session = TrainingSession.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .programId(programId)
                .workoutDayId(workoutDayId)
                .build();
        
        session.start();
        return sessionRepository.save(session);
    }
}
