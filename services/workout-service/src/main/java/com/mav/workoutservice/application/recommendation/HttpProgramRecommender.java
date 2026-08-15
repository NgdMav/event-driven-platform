package com.mav.workoutservice.application.recommendation;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@Primary
@RequiredArgsConstructor
@Slf4j
public class HttpProgramRecommender implements ProgramRecommendationPort {
    
    private final RestClient.Builder restClientBuilder;
    private final RuleBasedProgramRecommender fallback;
    
    @Value("${app.recommendation-service.url}")
    private String recommendationServiceUrl;
    
    @Override
    @CircuitBreaker(name = "recommendationService", fallbackMethod = "fallbackRecommend")
    @Retry(name = "recommendationService")
    public ProgramRecommendationResult recommend(ProgramRecommendationRequest request) {
        log.info("Calling recommendation-service for user {}", request.userId());
        RestClient client = restClientBuilder.baseUrl(recommendationServiceUrl).build();
        return client.post()
                .uri("/internal/recommendations/program")
                .body(request)
                .retrieve()
                .body(ProgramRecommendationResult.class);
    }
    
    public ProgramRecommendationResult fallbackRecommend(
            ProgramRecommendationRequest request, Throwable t) {
        log.warn("Recommendation service unavailable, using rule-based fallback: {}",
                t.getMessage());
        return fallback.recommend(request);
    }
}
