package com.mav.workoutservice.application;

import com.mav.workoutservice.api.dto.AddSetRequest;
import com.mav.workoutservice.domain.SetLog;
import com.mav.workoutservice.domain.TrainingSession;
import com.mav.workoutservice.domain.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddSetUseCase {
    
    private final TrainingSessionRepository sessionRepository;
    
    @Transactional
    public SetLog execute(UUID userId, UUID sessionId, AddSetRequest request) {
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        SetLog setLog = SetLog.builder()
                .id(UUID.randomUUID())
                .exerciseId(request.exerciseId())
                .setNumber(request.setNumber())
                .reps(request.reps())
                .weightKg(request.weightKg())
                .difficultyRating(request.difficultyRating())
                .completed(request.completed() != null ? request.completed() : true)
                .build();
        
        session.addSetLog(setLog);
        sessionRepository.save(session);
        return setLog;
    }
}
