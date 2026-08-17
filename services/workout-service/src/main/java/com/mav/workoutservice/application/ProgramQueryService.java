package com.mav.workoutservice.application;

import com.mav.workoutservice.api.dto.ProgramResponse;
import com.mav.workoutservice.domain.Program;
import com.mav.workoutservice.domain.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProgramQueryService {
    
    private final ProgramRepository programRepository;
    
    @Transactional(readOnly = true)
    public List<ProgramResponse> getPrograms(UUID userId) {
        return programRepository.findWithDetailsByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public ProgramResponse getProgram(UUID userId, UUID programId) {
        Program program = programRepository.findWithDetailsById(programId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Program not found"));
        if (!program.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return toResponse(program);
    }
    
    private ProgramResponse toResponse(Program program) {
        List<ProgramResponse.WorkoutDayResponse> days = program.getWorkoutDays().stream()
                .map(day -> new ProgramResponse.WorkoutDayResponse(
                        day.getId(),
                        day.getDayIndex(),
                        day.getTitle(),
                        day.getFocus(),
                        day.getExercises().stream()
                                .map(ex -> new ProgramResponse.WorkoutExerciseResponse(
                                        ex.getId(),
                                        ex.getExerciseId(),
                                        ex.getPosition(),
                                        ex.getSets(),
                                        ex.getRepsMin(),
                                        ex.getRepsMax(),
                                        ex.getRestSeconds()
                                ))
                                .toList()
                ))
                .toList();
        
        return new ProgramResponse(
                program.getId(),
                program.getUserId(),
                program.getName(),
                program.getGoal(),
                program.getDurationWeeks(),
                program.getDaysPerWeek(),
                program.getStatus().name(),
                program.getSource().name(),
                days,
                program.getCreatedAt()
        );
    }
}
