'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutClient } from '@/lib/api/clients/workout';
import type { LogSetRequest } from '@/lib/workout-types';

export function useRecommend() {
    return useMutation({ mutationFn: workoutClient.recommend });
}

export function useGenerateProgram() {
    return useMutation({ mutationFn: workoutClient.generateProgram });
}

export function useSession(sessionId: string) {
    return useQuery({
        queryKey: ['session', sessionId],
        queryFn: () => workoutClient.getSession(sessionId),
        enabled: !!sessionId,
    });
}

export function useCompleteSession(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => workoutClient.completeSession(sessionId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
        },
    });
}

/**
 * Logging a single set. The optimistic UI update (onMutate) lives in the
 * session page so it can flip the per-set local state instantly; this hook
 * owns the network call + cache invalidation.
 */
export function useLogSet(sessionId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (req: LogSetRequest) => workoutClient.logSet(sessionId, req),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
        },
    });
}
