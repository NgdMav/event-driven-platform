package com.mav.catalogservice.application;

import com.mav.catalogservice.api.dto.ExerciseDto;
import com.mav.catalogservice.api.dto.ExerciseFilterRequest;
import com.mav.catalogservice.domain.Exercise;
import com.mav.catalogservice.domain.ExerciseRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseService {
    
    private final ExerciseRepository exerciseRepository;
    
    @Transactional(readOnly = true)
    public List<ExerciseDto> getAllExercises() {
        return exerciseRepository.findByIsActive(true)
                .stream()
                .map(ExerciseDto::from)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public ExerciseDto getExerciseById(UUID id) {
        return exerciseRepository.findById(id)
                .map(ExerciseDto::from)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }
    
    @Transactional(readOnly = true)
    public ExerciseDto getExerciseBySlug(String slug) {
        return exerciseRepository.findBySlug(slug)
                .map(ExerciseDto::from)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }
    
    @Transactional(readOnly = true)
    public List<ExerciseDto> filterExercises(ExerciseFilterRequest request) {
        Specification<Exercise> spec = buildSpecification(request);
        return exerciseRepository.findAll(spec)
                .stream()
                .map(ExerciseDto::from)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<ExerciseDto> searchExercises(String search) {
        return exerciseRepository.searchByNameOrDescription(search)
                .stream()
                .map(ExerciseDto::from)
                .toList();
    }
    
    private Specification<Exercise> buildSpecification(ExerciseFilterRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (request.primaryMuscleGroup() != null) {
                predicates.add(cb.equal(root.get("primaryMuscleGroup"),
                        request.primaryMuscleGroup()));
            }
            
            if (request.difficulty() != null) {
                predicates.add(cb.equal(root.get("difficulty"), request.difficulty()));
            }
            
            if (request.equipment() != null) {
                predicates.add(cb.equal(root.get("equipment"), request.equipment()));
            }
            
            if (request.isActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.isActive()));
            } else {
                predicates.add(cb.equal(root.get("isActive"), true));
            }
            
            if (request.search() != null && !request.search().isBlank()) {
                String searchPattern = "%" + request.search().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchPattern),
                        cb.like(cb.lower(root.get("description")), searchPattern)
                ));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
