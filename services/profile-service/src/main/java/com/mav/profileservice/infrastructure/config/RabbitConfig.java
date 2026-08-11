package com.mav.profileservice.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    
    public static final String EXCHANGE = "fit.events";
    public static final String USER_REGISTERED_QUEUE = "profile-service.user-registered";
    public static final String USER_REGISTERED_ROUTING_KEY = "user.registered";
    
    @Bean
    public TopicExchange fitEventsExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }
    
    @Bean
    public Queue userRegisteredQueue() {
        return QueueBuilder.durable(USER_REGISTERED_QUEUE).build();
    }
    
    @Bean
    public Binding userRegisteredBinding(
            Queue userRegisteredQueue,
            TopicExchange fitEventsExchange
    ) {
        return BindingBuilder
                .bind(userRegisteredQueue)
                .to(fitEventsExchange)
                .with(USER_REGISTERED_ROUTING_KEY);
    }
}
