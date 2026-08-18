package com.mav.recommendationservice.application;

import com.mav.recommendationservice.api.dto.ExerciseRecommendationRequest;
import com.mav.recommendationservice.api.dto.ExerciseRecommendationResult;
import com.mav.recommendationservice.api.dto.ProgramRecommendationRequest;
import com.mav.recommendationservice.api.dto.ProgramRecommendationResult;
import com.mav.recommendationservice.domain.RecommendationLog;
import com.mav.recommendationservice.domain.RecommendationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {
    
    private final RuleBasedProgramRecommender programRecommender;
    private final RuleBasedExerciseRecommender exerciseRecommender;
    private final RecommendationLogRepository logRepository;
    private final ObjectMapper objectMapper;
    
    @Transactional
    public ProgramRecommendationResult recommendProgram(ProgramRecommendationRequest request) {
        ProgramRecommendationResult result = programRecommender.recommend(request);
        saveLog(request.userId(), "PROGRAM", request, result);
        return result;
    }
    
    @Transactional
    public ExerciseRecommendationResult recommendExercises(ExerciseRecommendationRequest request) {
        ExerciseRecommendationResult result = exerciseRecommender.recommend(request);
        saveLog(request.userId(), "EXERCISE", request, result);
        return result;
    }
    
    private void saveLog(UUID userId, String type, Object req, Object res) {
        try {
            RecommendationLog logEntry = RecommendationLog.builder()
                    .id(UUID.randomUUID())
                    .userId(userId)
                    .recommendationType(type)
                    .requestPayload(objectMapper.writeValueAsString(req))
                    .responsePayload(objectMapper.writeValueAsString(res))
                    .build();
            logRepository.save(logEntry);
        } catch (Exception e) {
            log.error("Failed to save recommendation log", e);
        }
    }
}
