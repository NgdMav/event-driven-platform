package com.mav.workoutservice.api;

import com.mav.workoutservice.api.dto.*;
import com.mav.workoutservice.application.AddSetUseCase;
import com.mav.workoutservice.application.CompleteSessionUseCase;
import com.mav.workoutservice.application.GenerateProgramUseCase;
import com.mav.workoutservice.application.StartSessionUseCase;
import com.mav.workoutservice.domain.Program;
import com.mav.workoutservice.domain.ProgramRepository;
import com.mav.workoutservice.domain.TrainingSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {
    
    private final GenerateProgramUseCase generateProgramUseCase;
    private final StartSessionUseCase startSessionUseCase;
    private final AddSetUseCase addSetUseCase;
    private final CompleteSessionUseCase completeSessionUseCase;
    private final ProgramRepository programRepository;
    
    // === PROGRAMS ===
    
    @PostMapping("/programs/generate")
    public ResponseEntity<ProgramResponse> generateProgram(
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody GenerateProgramRequest request
    ) {
        Program program = generateProgramUseCase.execute(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(program));
    }
    
    @GetMapping("/programs")
    public List<ProgramResponse> getPrograms(@RequestHeader("X-User-Id") UUID userId) {
        return programRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }
    
    @GetMapping("/programs/{id}")
    public ProgramResponse getProgram(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id
    ) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        if (!program.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        return toResponse(program);
    }
    
    // === SESSIONS ===
    
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> startSession(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody StartSessionRequest request
    ) {
        TrainingSession session = startSessionUseCase.execute(
                userId, request.programId(), request.workoutDayId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(session));
    }
    
    @PostMapping("/sessions/{id}/sets")
    public ResponseEntity<SessionResponse.SetLogResponse> addSet(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody AddSetRequest request
    ) {
        var setLog = addSetUseCase.execute(userId, id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new SessionResponse.SetLogResponse(
                        setLog.getId(),
                        setLog.getExerciseId(),
                        setLog.getSetNumber(),
                        setLog.getReps(),
                        setLog.getWeightKg(),
                        setLog.getCompleted()
                )
        );
    }
    
    @PostMapping("/sessions/{id}/complete")
    public SessionResponse completeSession(
            @RequestHeader("X-User-Id") UUID userId,
            @PathVariable UUID id
    ) {
        TrainingSession session = completeSessionUseCase.execute(userId, id);
        return toResponse(session);
    }
    
    // === Mappers ===
    
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
    
    private SessionResponse toResponse(TrainingSession session) {
        return new SessionResponse(
                session.getId(),
                session.getUserId(),
                session.getProgramId(),
                session.getWorkoutDayId(),
                session.getStatus().name(),
                session.getStartedAt(),
                session.getCompletedAt(),
                session.getSetLogs().stream()
                        .map(sl -> new SessionResponse.SetLogResponse(
                                sl.getId(),
                                sl.getExerciseId(),
                                sl.getSetNumber(),
                                sl.getReps(),
                                sl.getWeightKg(),
                                sl.getCompleted()
                        ))
                        .toList()
        );
    }
}
