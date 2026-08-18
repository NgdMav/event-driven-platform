package com.mav.workoutservice.infrastructure.messaging;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkoutRabbitConfig {
    
    public static final String EXCHANGE = "fit.events";
    public static final String SESSION_COMPLETED_QUEUE = "workout-service.session-completed";
    
    @Bean
    public TopicExchange fitEventsExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }
    
    @Bean
    public Queue sessionCompletedQueue() {
        return QueueBuilder.durable(SESSION_COMPLETED_QUEUE).build();
    }
    
    @Bean
    public Binding sessionCompletedBinding(Queue sessionCompletedQueue, TopicExchange fitEventsExchange) {
        return BindingBuilder.bind(sessionCompletedQueue).to(fitEventsExchange).with("workout.session-completed");
    }
}
