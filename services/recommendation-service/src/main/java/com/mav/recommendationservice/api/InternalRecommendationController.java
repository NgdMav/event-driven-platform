package com.mav.recommendationservice.api;

import com.mav.recommendationservice.api.dto.ExerciseRecommendationRequest;
import com.mav.recommendationservice.api.dto.ExerciseRecommendationResult;
import com.mav.recommendationservice.api.dto.ProgramRecommendationRequest;
import com.mav.recommendationservice.api.dto.ProgramRecommendationResult;
import com.mav.recommendationservice.application.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/internal/recommendations")
@RequiredArgsConstructor
public class InternalRecommendationController {
    
    private final RecommendationService recommendationService;
    
    @PostMapping("/program")
    public ProgramRecommendationResult recommendProgram(@RequestBody ProgramRecommendationRequest request) {
        return recommendationService.recommendProgram(request);
    }
    
    @PostMapping("/exercises")
    public ExerciseRecommendationResult recommendExercises(@RequestBody ExerciseRecommendationRequest request) {
        return recommendationService.recommendExercises(request);
    }
}
