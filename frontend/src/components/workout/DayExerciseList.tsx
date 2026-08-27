'use client';

import { ExerciseWorkoutCard } from '@/components/workout/ExerciseWorkoutCard';
import type { WorkoutDay } from '@/lib/types/workout';

export function DayExerciseList({ day }: { day: WorkoutDay }) {
    const ordered = [...day.exercises].sort((a, b) => a.position - b.position);

    if (ordered.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                В этот день пока нет упражнений.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {ordered.map((ex) => (
                <ExerciseWorkoutCard key={ex.id} exercise={ex} />
            ))}
        </div>
    );
}
