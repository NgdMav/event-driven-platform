package com.mav.workoutservice.infrastructure.messaging;

import com.mav.workoutservice.domain.OutboxEvent;
import com.mav.workoutservice.domain.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPoller {
    
    public static final String EXCHANGE = "fit.events";
    
    private final OutboxEventRepository outboxEventRepository;
    private final RabbitTemplate rabbitTemplate;
    
    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void publishPendingEvents() {
        List<OutboxEvent> pending = outboxEventRepository
                .findByPublishedAtIsNullOrderByCreatedAtAsc();
        
        for (OutboxEvent event : pending) {
            try {
                rabbitTemplate.convertAndSend(
                        EXCHANGE,
                        event.getEventType(),
                        event.getPayload(),
                        message -> {
                            message.getMessageProperties()
                                    .setContentType(MessageProperties.CONTENT_TYPE_JSON);
                            return message;
                        }
                );
                event.setPublishedAt(Instant.now());
                outboxEventRepository.save(event);
                log.info("Published event {} type={}", event.getId(), event.getEventType());
            } catch (Exception e) {
                log.error("Failed to publish outbox event {}", event.getId(), e);
                break; // остановимся, попробуем в следующий цикл
            }
        }
    }
}
