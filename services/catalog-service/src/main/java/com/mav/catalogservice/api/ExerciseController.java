package com.mav.catalogservice.api;

import com.mav.catalogservice.api.dto.ExerciseDto;
import com.mav.catalogservice.api.dto.ExerciseFilterRequest;
import com.mav.catalogservice.application.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalog/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;
    
    @GetMapping
    public List<ExerciseDto> getAllExercises() {
        return exerciseService.getAllExercises();
    }
    
    @GetMapping("/{id}")
    public ExerciseDto getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id);
    }
    
    @GetMapping("/slug/{slug}")
    public ExerciseDto getExerciseBySlug(@PathVariable String slug) {
        return exerciseService.getExerciseBySlug(slug);
    }
    
    @PostMapping("/filter")
    public List<ExerciseDto> filterExercises(@RequestBody ExerciseFilterRequest request) {
        return exerciseService.filterExercises(request);
    }
    
    @GetMapping("/search")
    public List<ExerciseDto> searchExercises(@RequestParam String query) {
        return exerciseService.searchExercises(query);
    }
}
