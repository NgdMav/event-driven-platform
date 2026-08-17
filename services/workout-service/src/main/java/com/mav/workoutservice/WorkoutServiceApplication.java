package com.mav.workoutservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WorkoutServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(WorkoutServiceApplication.class, args);
    }
    
}
