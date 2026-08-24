// ===== Workout feature DTOs (frontend contract) =====
// NOTE: These follow the frontend task spec. Several fields differ from the
// current backend workout-service contracts — see the integration notes in
// src/lib/api/clients/workout.ts before wiring to a live gateway.

export type WorkoutGoal = 'MUSCLE_GAIN' | 'FAT_LOSS' | 'STRENGTH' | 'GENERAL_FITNESS';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface ProgramRecommendationRequest {
    goal: WorkoutGoal;
    experienceLevel: ExperienceLevel;
    daysPerWeek: number;
    availableEquipment: string[];
    currentWeightKg?: number;
    heightCm?: number;
}

export interface ProgramRecommendationResponse {
    programTemplateId: string;
    confidence: number;
    reasons: string[];
    suggestedFocus: string[];
    /** Convenience display title; derived server-side in the real backend. */
    name?: string;
}

export interface GenerateProgramRequest {
    goal: WorkoutGoal;
    experienceLevel: ExperienceLevel;
    daysPerWeek: number;
    activityLevel?: string;
}

export interface GenerateProgramResponse {
    id: string;
    name: string;
    status: string;
}

export interface PlannedSet {
    setNumber: number;
    targetWeightKg?: number;
    targetReps?: string;
}

export interface SessionExercise {
    exerciseId: string;
    name: string;
    targetMuscleGroup: string;
    sets: PlannedSet[];
}

export interface WorkoutSessionResponse {
    sessionId: string;
    dayTitle: string;
    programName?: string;
    status: string;
    exercises: SessionExercise[];
}

export interface LogSetRequest {
    exerciseId: string;
    setNumber: number;
    weightKg: number;
    reps: number;
    completed: true;
}

export interface CompleteSessionResponse {
    sessionId: string;
    status: string;
}
