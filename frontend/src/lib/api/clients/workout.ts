import { api } from '@/lib/api';
import type {
    AddSetRequest,
    Program,
    Session,
    StartSessionRequest,
} from '@/lib/types/workout';
import type {
    ProgramRecommendationRequest,
    ProgramRecommendationResponse,
} from '@/lib/workout-types';

export const workoutClient = {
    // ----- Programs -----
    getPrograms: () => api.get<Program[]>('/workouts/programs').then((r) => r.data),

    getProgram: (id: string) =>
        api.get<Program>(`/workouts/programs/${id}`).then((r) => r.data),

    generateProgram: (req: GenerateProgramRequest) =>
        api.post<Program>('/workouts/programs/generate', req).then((r) => r.data),

    // ----- Sessions -----
    startSession: (req: StartSessionRequest) =>
        api.post<Session>('/workouts/sessions', req).then((r) => r.data),

    addSet: (sessionId: string, req: AddSetRequest) =>
        api
            .post<Session['setLogs'][number]>(
                `/workouts/sessions/${sessionId}/sets`,
                req
            )
            .then((r) => r.data),

    completeSession: (sessionId: string) =>
        api
            .post<Session>(`/workouts/sessions/${sessionId}/complete`, {})
            .then((r) => r.data),

    // ----- Recommendation (pre-generation step, already wired) -----
    recommend: (req: ProgramRecommendationRequest) =>
        api
            .post<ProgramRecommendationResponse>('/recommendations/program', req)
            .then((r) => r.data),
};

export interface GenerateProgramRequest {
    goal: string;
    experienceLevel: string;
    daysPerWeek: number;
    activityLevel?: string;
}
