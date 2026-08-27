'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgram } from '@/hooks/use-programs';
import { useStartSession } from '@/hooks/use-workout-session';
import { useActiveSessionStore } from '@/store/active-session-store';
import { DayTabs } from '@/components/workout/DayTabs';
import { DayExerciseList } from '@/components/workout/DayExerciseList';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import {
    PROGRAM_GOAL_LABELS,
    PROGRAM_STATUS_LABELS,
    PROGRAM_STATUS_VARIANT,
} from '@/lib/types/workout';
import { CalendarDays, Dumbbell, Layers, Play, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProgramDetailPage() {
    const params = useParams<{ programId: string }>();
    const programId = params?.programId ?? '';
    const router = useRouter();

    const { data: program, isLoading, isError, error, refetch } = useProgram(programId);
    const startSession = useStartSession();
    const setActive = useActiveSessionStore((s) => s.setActive);
    const active = useActiveSessionStore((s) => s.active);
    const hasHydrated = useActiveSessionStore((s) => s._hasHydrated);

    const [selectedDayId, setSelectedDayId] = useState<string>('');

    const orderedDays = useMemo(
        () => (program ? [...program.workoutDays].sort((a, b) => a.dayIndex - b.dayIndex) : []),
        [program]
    );

    const effectiveDayId = selectedDayId || orderedDays[0]?.id || '';
    const selectedDay = orderedDays.find((d) => d.id === effectiveDayId) ?? null;

    const resumeSessionId =
        hasHydrated &&
        active &&
        active.programId === programId &&
        active.workoutDayId === effectiveDayId
            ? active.sessionId
            : null;

    const handleStart = () => {
        if (!selectedDay) return;
        startSession.mutate(
            { programId, workoutDayId: selectedDay.id },
            {
                onSuccess: (session) => {
                    setActive({
                        sessionId: session.id,
                        programId: session.programId,
                        workoutDayId: session.workoutDayId,
                        startedAt: session.startedAt,
                    });
                    router.push(`/session/${session.id}`);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-3xl space-y-4 p-1">
                <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-3xl p-1">
                <ErrorState message={extractError(error)} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="mx-auto max-w-3xl p-1">
                <EmptyState title="Программа не найдена" description="Возможно, ссылка устарела." />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl">
            <button
                type="button"
                onClick={() => router.push('/programs')}
                className="mb-3 text-sm text-gray-500 hover:text-gray-700"
            >
                ← К программам
            </button>

            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{program.name}</h1>
                    <span
                        className={cn(
                            'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                            PROGRAM_STATUS_VARIANT[program.status]
                        )}
                    >
                        {PROGRAM_STATUS_LABELS[program.status]}
                    </span>
                </div>
                <p className="mt-1 text-sm text-emerald-600">
                    {PROGRAM_GOAL_LABELS[program.goal] ?? program.goal}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" /> {program.daysPerWeek} дн./нед.
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" /> {program.durationWeeks} нед.
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Dumbbell className="h-3.5 w-3.5" /> {program.workoutDays.length} дн.
                    </span>
                </div>
            </div>

            {/* Day switcher */}
            {orderedDays.length > 0 && (
                <div className="mt-5">
                    <DayTabs
                        days={orderedDays}
                        selectedId={effectiveDayId}
                        onSelect={setSelectedDayId}
                    />
                </div>
            )}

            {/* Day content */}
            {selectedDay && (
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {selectedDay.title}
                            </h2>
                            <p className="text-xs text-gray-500">
                                День {selectedDay.dayIndex}
                                {selectedDay.focus ? ` · ${selectedDay.focus}` : ''}
                            </p>
                        </div>
                        {resumeSessionId ? (
                            <Button
                                variant="secondary"
                                onClick={() => router.push(`/session/${resumeSessionId}`)}
                            >
                                <RotateCw className="h-4 w-4" /> Продолжить
                            </Button>
                        ) : (
                            <Button
                                onClick={handleStart}
                                disabled={startSession.isPending}
                            >
                                <Play className="h-4 w-4" /> Начать тренировку
                            </Button>
                        )}
                    </div>

                    <DayExerciseList day={selectedDay} />
                </div>
            )}
        </div>
    );
}

function extractError(err: unknown): string {
    const e = err as { response?: { data?: { detail?: string; message?: string } } };
    return (
        e?.response?.data?.detail ??
        e?.response?.data?.message ??
        'Не удалось загрузить программу.'
    );
}
