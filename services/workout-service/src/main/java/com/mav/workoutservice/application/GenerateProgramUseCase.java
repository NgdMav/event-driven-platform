package com.mav.workoutservice.application;

import com.mav.workoutservice.api.dto.GenerateProgramRequest;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationPort;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationRequest;
import com.mav.workoutservice.application.recommendation.ProgramRecommendationResult;
import com.mav.workoutservice.domain.*;
import com.mav.workoutservice.integration.CatalogClient;
import com.mav.workoutservice.integration.ExerciseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenerateProgramUseCase {
    
    private final ProgramRecommendationPort recommendationPort;
    private final ProgramRepository programRepository;
    private final CatalogClient catalogClient;
    
    @Transactional
    public Program execute(UUID userId, GenerateProgramRequest request) {
        // 1. Получаем рекомендацию
        ProgramRecommendationResult recommendation = recommendationPort.recommend(
                new ProgramRecommendationRequest(
                        userId,
                        request.goal(),
                        request.experienceLevel(),
                        request.daysPerWeek(),
                        request.activityLevel()
                )
        );
        
        // 2. Создаём программу
        Program program = Program.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .name(recommendation.name())
                .goal(request.goal())
                .durationWeeks(recommendation.durationWeeks())
                .daysPerWeek(recommendation.daysPerWeek())
                .status(ProgramStatus.DRAFT)
                .source(ProgramSource.RECOMMENDATION_SERVICE)
                .build();
        
        // 3. Создаём дни и упражнения
        for (ProgramRecommendationResult.DayTemplate dayTemplate : recommendation.days()) {
            WorkoutDay day = WorkoutDay.builder()
                    .id(UUID.randomUUID())
                    .program(program)
                    .dayIndex(dayTemplate.dayIndex())
                    .title(dayTemplate.title())
                    .focus(dayTemplate.focus())
                    .build();
            
            int position = 1;
            for (ProgramRecommendationResult.ExerciseTemplate exTemplate : dayTemplate.exercises()) {
                UUID exerciseId = resolveExerciseId(exTemplate.exerciseSlug());
                if (exerciseId == null) {
                    log.warn("Exercise with slug {} not found, skipping",
                            exTemplate.exerciseSlug());
                    continue;
                }
                
                WorkoutExercise exercise = WorkoutExercise.builder()
                        .id(UUID.randomUUID())
                        .workoutDay(day)
                        .exerciseId(exerciseId)
                        .position(position++)
                        .sets(exTemplate.sets())
                        .repsMin(exTemplate.repsMin())
                        .repsMax(exTemplate.repsMax())
                        .restSeconds(exTemplate.restSeconds())
                        .build();
                
                day.getExercises().add(exercise);
            }
            
            program.getWorkoutDays().add(day);
        }
        
        return programRepository.save(program);
    }
    
    private UUID resolveExerciseId(String slug) {
        try {
            ExerciseDto exercise = catalogClient.getExerciseBySlug(slug);
            return exercise != null ? exercise.id() : null;
        } catch (Exception e) {
            log.warn("Не удалось найти упражнение по slug: '{}'. Причина: {}", slug, e.getMessage());
            return null;
        }
    }
}
