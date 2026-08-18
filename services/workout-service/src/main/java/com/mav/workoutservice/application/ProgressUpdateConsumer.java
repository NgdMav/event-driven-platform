package com.mav.workoutservice.application;

import com.mav.workoutservice.domain.ProgressSnapshot;
import com.mav.workoutservice.domain.ProgressSnapshotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProgressUpdateConsumer {
    
    private final ProgressSnapshotRepository snapshotRepository;
    private final ObjectMapper objectMapper;
    
    @RabbitListener(queues = "workout-service.session-completed")
    @Transactional
    public void handleSessionCompleted(String message) {
        
        try {
            JsonNode root = objectMapper.readTree(message);
            JsonNode payload = root.get("payload");
            
            UUID userId = UUID.fromString(payload.get("userId").asText());
            BigDecimal volume = new BigDecimal(payload.get("totalVolumeKg").asText());
            int duration = payload.has("durationMinutes") ? payload.get("durationMinutes").asInt() : 0;
            
            LocalDate today = LocalDate.now();
            
            ProgressSnapshot snapshot = snapshotRepository.findByUserIdAndSnapshotDate(userId, today)
                    .orElseGet(() -> ProgressSnapshot.builder()
                            .id(UUID.randomUUID())
                            .userId(userId)
                            .snapshotDate(today)
                            .totalSessions(0)
                            .completedSessions(0)
                            .totalVolumeKg(BigDecimal.ZERO)
                            .avgSessionDurationMinutes(0)
                            .build());
            
            int newCompleted = snapshot.getCompletedSessions() + 1;
            
            int currentTotalDuration = (snapshot.getAvgSessionDurationMinutes() != null ? snapshot.getAvgSessionDurationMinutes() : 0) * snapshot.getCompletedSessions();
            int newAvgDuration = BigDecimal.valueOf(currentTotalDuration + duration)
                    .divide(BigDecimal.valueOf(newCompleted), RoundingMode.HALF_UP).intValue();
            
            snapshot.setTotalSessions(snapshot.getTotalSessions() + 1);
            snapshot.setCompletedSessions(newCompleted);
            snapshot.setTotalVolumeKg(snapshot.getTotalVolumeKg().add(volume));
            snapshot.setAvgSessionDurationMinutes(newAvgDuration);
            
            snapshotRepository.save(snapshot);
            log.info("Updated progress snapshot for user {} on {}", userId, today);
            
        } catch (Exception e) {
            log.error("Failed to process session completed event", e);
        }
    }
}
