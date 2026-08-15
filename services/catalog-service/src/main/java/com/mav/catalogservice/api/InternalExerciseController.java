package com.mav.catalogservice.api;

import com.mav.catalogservice.api.dto.ExerciseDto;
import com.mav.catalogservice.application.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/internal/exercises")
@RequiredArgsConstructor
public class InternalExerciseController {
    
    private final ExerciseService exerciseService;
    
    @GetMapping("/{id}")
    public ExerciseDto getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id);
    }
    
    @GetMapping("/ids")
    public List<ExerciseDto> getExercisesByIds(@RequestParam List<UUID> ids) {
        return ids.stream()
                .map(exerciseService::getExerciseById)
                .toList();
    }
}
