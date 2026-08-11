package com.mav.profileservice.application;

import com.mav.profileservice.domain.ProcessedEvent;
import com.mav.profileservice.domain.ProcessedEventRepository;
import com.mav.profileservice.integration.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserRegisteredEventListener {
    
    private final ObjectMapper objectMapper;
    private final ProfileService profileService;
    private final ProcessedEventRepository processedEventRepository;
    
    @RabbitListener(queues = "profile-service.user-registered")
    @Transactional
    public void onUserRegistered(String message) {
        UserRegisteredEvent event;
        
        try {
            event = objectMapper.readValue(message, UserRegisteredEvent.class);
        } catch (JacksonException e) {
            log.error("Failed to parse user.registered event", e);
            return;
        }
        
        if (processedEventRepository.existsById(event.eventId())) {
            log.info("Event {} already processed", event.eventId());
            return;
        }
        
        log.info("Processing user.registered event: userId={}", event.payload().userId());
        
        profileService.ensureProfileExists(event.payload().userId());
        
        processedEventRepository.save(
                ProcessedEvent.builder()
                        .eventId(event.eventId())
                        .eventType(event.eventType())
                        .build()
        );
    }
}
