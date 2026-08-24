package com.mav.workoutservice.api;

import com.mav.workoutservice.api.dto.ProgramRecommendationResponse;
import com.mav.workoutservice.api.dto.RecommendationRequest;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationPort;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationRequest;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {

    private final ProgramRecommendationPort recommendationPort;

    @PostMapping("/program")
    public ResponseEntity<ProgramRecommendationResponse> recommendProgram(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody RecommendationRequest request
    ) {
        ProgramRecommendationResult result = recommendationPort.recommend(
                new ProgramRecommendationRequest(
                        userId,
                        request.goal(),
                        request.experienceLevel(),
                        request.daysPerWeek(),
                        request.activityLevel() != null ? request.activityLevel() : request.experienceLevel()
                )
        );

        List<String> suggestedFocus = result.days().stream()
                .map(ProgramRecommendationResult.DayTemplate::focus)
                .distinct()
                .toList();

        List<String> reasons = buildReasons(request, result);

        return ResponseEntity.ok(new ProgramRecommendationResponse(
                result.programTemplate(),
                result.name(),
                0.9,
                reasons,
                suggestedFocus
        ));
    }

    private List<String> buildReasons(RecommendationRequest request, ProgramRecommendationResult result) {
        List<String> reasons = new ArrayList<>();
        reasons.add("Программа «%s» подобрана под вашу цель и уровень.".formatted(result.name()));
        reasons.add("Частота тренировок: %d в неделю.".formatted(request.daysPerWeek()));
        if (request.availableEquipment() != null && !request.availableEquipment().isEmpty()) {
            reasons.add("Учтён доступный инвентарь: %s.".formatted(String.join(", ", request.availableEquipment())));
        }
        return reasons;
    }
}
