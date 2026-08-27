'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutClient } from '@/lib/api/clients/workout';
import type { AddSetRequest, StartSessionRequest } from '@/lib/types/workout';
import { useToast } from '@/components/ui/toast';

export function useStartSession() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: (req: StartSessionRequest) => workoutClient.startSession(req),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['programs'] });
            toast('Тренировка начата!', 'success');
        },
        onError: () => {
            toast('Не удалось начать тренировку', 'error');
        },
    });
}

export function useAddSet(sessionId: string) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: (req: AddSetRequest) => workoutClient.addSet(sessionId, req),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['programs'] });
        },
        onError: () => {
            toast('Не удалось сохранить подход', 'error');
        },
    });
}

export function useCompleteSession(sessionId: string) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    return useMutation({
        mutationFn: () => workoutClient.completeSession(sessionId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['programs'] });
            toast('Тренировка завершена!', 'success');
        },
        onError: () => {
            toast('Не удалось завершить тренировку', 'error');
        },
    });
}
