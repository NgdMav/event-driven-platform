package com.mav.authservice.application;

//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
import com.mav.authservice.domain.User;
import com.mav.authservice.integration.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
class AuthEventPublisher {
    
    public static final String EXCHANGE = "fit.events";
    public static final String ROUTING_KEY_USER_REGISTERED = "user.registered";
    
    private final RabbitTemplate rabbitTemplate;
//    private final ObjectMapper objectMapper;
    
    public void publishUserRegistered(User user) {
        try {
            UserRegisteredEvent event = new UserRegisteredEvent(
                    UUID.randomUUID(),
                    "user.registered",
                    Instant.now(),
                    "auth-service",
                    new UserRegisteredEvent.Payload(
                            user.getId(),
                            user.getEmail(),
                            user.getCreatedAt()
                    )
            );
            
//            String json = objectMapper.writeValueAsString(event);
            
            rabbitTemplate.convertAndSend(
                    EXCHANGE,
                    ROUTING_KEY_USER_REGISTERED,
                    event,
                    message -> {
                        message.getMessageProperties()
                                .setContentType(MessageProperties.CONTENT_TYPE_JSON);
                        return message;
                    }
            );
            
            log.info("Published user.registered event for userId={}", user.getId());
        } catch (Exception e) {
            log.error("Failed to serialize user.registered event", e);
            throw new IllegalStateException("Failed to publish user.registered event", e);
        }
    }
}
