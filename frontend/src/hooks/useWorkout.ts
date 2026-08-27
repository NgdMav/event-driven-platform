'use client';

import { useMutation } from '@tanstack/react-query';
import { workoutClient, type GenerateProgramRequest } from '@/lib/api/clients/workout';
import type { Program } from '@/lib/types/workout';
import type {
    ProgramRecommendationRequest,
    ProgramRecommendationResponse,
} from '@/lib/workout-types';

export function useRecommend() {
    return useMutation({
        mutationFn: (req: ProgramRecommendationRequest) => workoutClient.recommend(req),
    });
}

export function useGenerateProgram() {
    return useMutation({
        mutationFn: (req: GenerateProgramRequest) => workoutClient.generateProgram(req),
    });
}

export type { Program, ProgramRecommendationResponse };
