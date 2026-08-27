// ===== Workout feature DTOs (Programs & Session Tracking contract) =====
import type { Equipment, MuscleGroup } from '@/lib/types';

export type ProgramGoal =
    | 'MUSCLE_GAIN'
    | 'FAT_LOSS'
    | 'STRENGTH'
    | 'GENERAL_FITNESS'
    | 'ENDURANCE';

export type ProgramStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';

export type ProgramSource = 'RECOMMENDATION_SERVICE' | 'MANUAL' | string;

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    position: number;
    sets: number;
    repsMin: number;
    repsMax: number;
    restSeconds: number;
}

export interface WorkoutDay {
    id: string;
    dayIndex: number;
    title: string;
    focus: string;
    exercises: WorkoutExercise[];
}

export interface Program {
    id: string;
    name: string;
    goal: ProgramGoal;
    durationWeeks: number;
    daysPerWeek: number;
    status: ProgramStatus;
    source: ProgramSource;
    workoutDays: WorkoutDay[];
    createdAt: string;
}

// ===== Session =====
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface SetLog {
    id: string;
    exerciseId: string;
    setNumber: number;
    reps: number;
    weightKg: number;
    completed: boolean;
}

export interface Session {
    id: string;
    userId: string;
    programId: string;
    workoutDayId: string;
    status: SessionStatus;
    startedAt: string;
    completedAt: string | null;
    setLogs: SetLog[];
}

// ===== Request bodies =====
export interface StartSessionRequest {
    programId: string;
    workoutDayId: string;
}

export interface AddSetRequest {
    exerciseId: string;
    setNumber: number;
    reps: number;
    weightKg: number;
    difficultyRating?: number;
    completed: boolean;
}

// ===== Display labels (RU) =====
export const PROGRAM_GOAL_LABELS: Record<ProgramGoal, string> = {
    MUSCLE_GAIN: 'Набор массы',
    FAT_LOSS: 'Снижение веса',
    STRENGTH: 'Сила',
    GENERAL_FITNESS: 'Общая форма',
    ENDURANCE: 'Выносливость',
};

export const PROGRAM_STATUS_LABELS: Record<ProgramStatus, string> = {
    DRAFT: 'Черновик',
    ACTIVE: 'Активна',
    ARCHIVED: 'В архиве',
    COMPLETED: 'Завершена',
};

export const PROGRAM_STATUS_VARIANT: Record<ProgramStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    ARCHIVED: 'bg-amber-100 text-amber-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
};

export type { Equipment, MuscleGroup };
