'use client';

import { useQuery } from '@tanstack/react-query';
import { workoutClient } from '@/lib/api/clients/workout';

export function usePrograms() {
    return useQuery({
        queryKey: ['programs'],
        queryFn: () => workoutClient.getPrograms(),
    });
}

export function useProgram(id: string) {
    return useQuery({
        queryKey: ['program', id],
        queryFn: () => workoutClient.getProgram(id),
        enabled: !!id,
    });
}
