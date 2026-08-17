package com.mav.workoutservice.application;

import com.mav.workoutservice.domain.OutboxEvent;
import com.mav.workoutservice.domain.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OutboxPublisher {
    
    private final OutboxEventRepository outboxEventRepository;
    
    public void publish(String aggregateType, UUID aggregateId,
                        String eventType, String payloadJson) {
        OutboxEvent event = OutboxEvent.builder()
                .id(UUID.randomUUID())
                .aggregateType(aggregateType)
                .aggregateId(aggregateId)
                .eventType(eventType)
                .payload(payloadJson)
                .build();
        outboxEventRepository.save(event);
    }
}
