import { api } from '@/lib/api';
import type {
    CompleteSessionResponse,
    GenerateProgramRequest,
    GenerateProgramResponse,
    LogSetRequest,
    ProgramRecommendationRequest,
    ProgramRecommendationResponse,
    WorkoutSessionResponse,
} from '@/lib/workout-types';

// ---------------------------------------------------------------------------
// Integration notes (backend reality vs. this contract):
//  - The gateway currently routes only /api/workouts/**, /api/auth/**,
//    /api/profile/**, /api/catalog/**. The spec's /api/recommendations/**
//    endpoint is NOT routed yet — add a gateway route or rename to
//    /api/workouts/recommendations to reach it.
//  - The real GenerateProgramRequest is goal-based (goal, experienceLevel,
//    daysPerWeek, activityLevel) rather than { templateId }. Adapt here if you
//    want to call the live endpoint instead of a recommendations-id flow.
//  - The real backend has no GET /sessions/{id}; sessions are returned from
//    POST /sessions and /sessions/{id}/sets. Wire getSession to the actual
//    source (e.g. program day + started session) when available.
// ---------------------------------------------------------------------------

export const workoutClient = {
    recommend: (req: ProgramRecommendationRequest) =>
        api
            .post<ProgramRecommendationResponse>('/recommendations/program', req)
            .then((r) => r.data),

    generateProgram: (req: GenerateProgramRequest) =>
        api
            .post<GenerateProgramResponse>('/workouts/programs/generate', req)
            .then((r) => r.data),

    getSession: (sessionId: string) =>
        api
            .get<WorkoutSessionResponse>(`/workouts/sessions/${sessionId}`)
            .then((r) => r.data),

    logSet: (sessionId: string, req: LogSetRequest) =>
        api.post(`/workouts/sessions/${sessionId}/sets`, req).then((r) => r.data),

    completeSession: (sessionId: string) =>
        api
            .post<CompleteSessionResponse>(`/workouts/sessions/${sessionId}/complete`, {})
            .then((r) => r.data),
};
