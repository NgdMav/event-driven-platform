import Link from 'next/link';
import { Badge } from '@/components/Badge';
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
                <Badge variant="blue">{MUSCLE_GROUP_LABELS[exercise.primaryMuscleGroup]}</Badge>
                <Badge variant="gray">{DIFFICULTY_LABELS[exercise.difficulty]}</Badge>
                <Badge variant="purple">{EQUIPMENT_LABELS[exercise.equipment]}</Badge>
            </div>

            {exercise.description && (
                <p className="mt-3 line-clamp-3 text-sm text-gray-600">{exercise.description}</p>
            )}
        </Link>
    );
}
