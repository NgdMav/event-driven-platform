'use client';

import { useExerciseById } from '@/hooks/useExercises';
import {
    EQUIPMENT_LABELS,
    MUSCLE_GROUP_LABELS,
} from '@/lib/types';
import type { WorkoutExercise } from '@/lib/types/workout';
import { Spinner } from '@/components/Spinner';
import { Clock, Dumbbell, Target } from 'lucide-react';

export function ExerciseWorkoutCard({ exercise }: { exercise: WorkoutExercise }) {
    const { data, isLoading, isError } = useExerciseById(exercise.exerciseId);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Spinner className="h-4 w-4" /> Загрузка…
                        </div>
                    ) : isError || !data ? (
                        <p className="text-sm font-medium text-gray-900">Упражнение</p>
                    ) : (
                        <p className="truncate text-sm font-semibold text-gray-900">
                            {data.name}
                        </p>
                    )}

                    {data && (
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                                <Target className="h-3.5 w-3.5" />
                                {MUSCLE_GROUP_LABELS[data.primaryMuscleGroup] ??
                                    data.primaryMuscleGroup}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Dumbbell className="h-3.5 w-3.5" />
                                {EQUIPMENT_LABELS[data.equipment] ?? data.equipment}
                            </span>
                        </p>
                    )}
                </div>

                <div className="shrink-0 text-right text-xs text-gray-500">
                    <p className="font-medium text-gray-700">
                        {exercise.sets} × {exercise.repsMin}–{exercise.repsMax}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {exercise.restSeconds} с
                    </p>
                </div>
            </div>
        </div>
    );
}
