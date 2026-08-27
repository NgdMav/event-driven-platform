'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Dumbbell, Video } from 'lucide-react';
import { useExercise } from '@/hooks/useExercises';
import {
    DIFFICULTY_LABELS,
    EQUIPMENT_LABELS,
    MUSCLE_GROUP_LABELS,
} from '@/lib/types';
import { Spinner } from '@/components/Spinner';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/Badge';

export default function ExerciseDetailPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug ?? '';
    const { data: exercise, isLoading, isError, error, refetch } = useExercise(slug);

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8 text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={extractErrorSafe(error)} onRetry={() => refetch()} />;
    }

    if (!exercise) {
        return (
            <EmptyState
                icon={<Dumbbell className="h-10 w-10" />}
                title="Упражнение не найдено"
                description="Возможно, оно было удалено или ссылка устарела."
                action={
                    <Link
                        href="/exercises"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        К каталогу
                    </Link>
                }
            />
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Link
                href="/exercises"
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
                <ArrowLeft size={16} /> К каталогу
            </Link>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {exercise.thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={exercise.thumbnailUrl}
                        alt={exercise.name}
                        className="h-56 w-full object-cover"
                    />
                )}

                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">{exercise.name}</h1>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="blue">{MUSCLE_GROUP_LABELS[exercise.primaryMuscleGroup]}</Badge>
                        <Badge variant="gray">{DIFFICULTY_LABELS[exercise.difficulty]}</Badge>
                        <Badge variant="purple">{EQUIPMENT_LABELS[exercise.equipment]}</Badge>
                    </div>

                    {exercise.secondaryMuscleGroups.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Дополнительные мышцы</h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {exercise.secondaryMuscleGroups.map((m) => (
                                <Badge key={m} variant="gray">
                                    {MUSCLE_GROUP_LABELS[m]}
                                </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {exercise.description && (
                        <Section title="Описание" body={exercise.description} />
                    )}
                    {exercise.technique && <Section title="Техника выполнения" body={exercise.technique} />}

                    {exercise.videoUrl && (
                        <a
                            href={exercise.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Video size={16} /> Смотреть видео
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ title, body }: { title: string; body: string }) {
    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">{body}</p>
        </div>
    );
}

function extractErrorSafe(error: unknown): string {
    const err = error as { response?: { data?: { detail?: string; message?: string } } };
    return err?.response?.data?.detail ?? err?.response?.data?.message ?? 'Не удалось загрузить упражнение.';
}
