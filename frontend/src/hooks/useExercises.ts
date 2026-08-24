'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogClient } from '@/lib/api/clients/catalog';
import type { Difficulty, Equipment, MuscleGroup } from '@/lib/types';

export interface ExerciseFilters {
    search?: string;
    muscle?: MuscleGroup | '';
    difficulty?: Difficulty | '';
    equipment?: Equipment | '';
}

export function useExercises(filters: ExerciseFilters) {
    const { search, muscle, difficulty, equipment } = filters;

    return useQuery({
        queryKey: ['exercises', filters],
        queryFn: async () => {
            if (search && search.trim().length > 0) {
                return catalogClient.search(search.trim());
            }

            const hasFilter = muscle || difficulty || equipment;
            if (hasFilter) {
                return catalogClient.filter({
                    primaryMuscleGroup: muscle || undefined,
                    difficulty: difficulty || undefined,
                    equipment: equipment || undefined,
                    isActive: true,
                });
            }

            return catalogClient.getAll();
        },
    });
}

export function useExercise(slug: string) {
    return useQuery({
        queryKey: ['exercise', slug],
        queryFn: () => catalogClient.getBySlug(slug),
        enabled: !!slug,
    });
}
