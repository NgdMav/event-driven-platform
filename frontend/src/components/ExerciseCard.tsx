import Link from 'next/link';
import {
    DIFFICULTY_LABELS,
    EQUIPMENT_LABELS,
    MUSCLE_GROUP_LABELS,
    type ExerciseDto,
} from '@/lib/types';

export function ExerciseCard({ exercise }: { exercise: ExerciseDto }) {
    return (
        <Link
            href={`/exercises/${exercise.slug}`}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                {exercise.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {MUSCLE_GROUP_LABELS[exercise.primaryMuscleGroup]}
                </span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {DIFFICULTY_LABELS[exercise.difficulty]}
                </span>
                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                    {EQUIPMENT_LABELS[exercise.equipment]}
                </span>
            </div>

            {exercise.description && (
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{exercise.description}</p>
            )}
        </Link>
    );
}
