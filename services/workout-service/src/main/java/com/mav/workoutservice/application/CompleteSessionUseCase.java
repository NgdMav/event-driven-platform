package com.mav.workoutservice.application;

import com.mav.workoutservice.domain.SetLog;
import com.mav.workoutservice.domain.TrainingSession;
import com.mav.workoutservice.domain.TrainingSessionRepository;
import com.mav.workoutservice.integration.event.WorkoutSessionCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompleteSessionUseCase {
    
    private final TrainingSessionRepository sessionRepository;
    private final OutboxPublisher outboxPublisher;
    private final ObjectMapper objectMapper;
    
    @Transactional
    public TrainingSession execute(UUID userId, UUID sessionId) {
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        session.complete();
        sessionRepository.save(session);
        
        // Публикуем событие через outbox
        publishSessionCompletedEvent(session);
        
        return session;
    }
    
    private void publishSessionCompletedEvent(TrainingSession session) {
        try {
            long durationMinutes = 0;
            if (session.getStartedAt() != null && session.getCompletedAt() != null) {
                durationMinutes = Duration.between(
                        session.getStartedAt(),
                        session.getCompletedAt()
                ).toMinutes();
            }
            
            int completedSets = (int) session.getSetLogs().stream()
                    .filter(SetLog::getCompleted)
                    .count();
            
            WorkoutSessionCompletedEvent event = new WorkoutSessionCompletedEvent(
                    UUID.randomUUID(),
                    "workout.session-completed",
                    Instant.now(),
                    "workout-service",
                    new WorkoutSessionCompletedEvent.Payload(
                            session.getUserId(),
                            session.getId(),
                            session.getProgramId(),
                            durationMinutes,
                            session.getSetLogs().size(),
                            completedSets
                    )
            );
            
            String json = objectMapper.writeValueAsString(event);
            outboxPublisher.publish(
                    "TrainingSession",
                    session.getId(),
                    "workout.session-completed",
                    json
            );
        } catch (Exception e) {
            log.error("Failed to prepare session completed event", e);
        }
    }
}
