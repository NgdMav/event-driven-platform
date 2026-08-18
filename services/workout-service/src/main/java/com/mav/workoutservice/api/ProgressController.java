package com.mav.workoutservice.api;

import com.mav.workoutservice.api.dto.ProgressSummaryDto;
import com.mav.workoutservice.application.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@RestController
@RequestMapping("/api/workouts/progress")
@RequiredArgsConstructor
public class ProgressController {
    
    private final ProgressService progressService;
    
    @GetMapping("/summary")
    public ProgressSummaryDto getSummary(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return progressService.getSummary(userId);
    }
}
