'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProgram } from '@/hooks/use-programs';
import { useAddSet, useCompleteSession } from '@/hooks/use-workout-session';
import { useExerciseById } from '@/hooks/useExercises';
import { useActiveSessionStore } from '@/store/active-session-store';
import { SetRow } from '@/components/workout/SetRow';
import { RestTimer } from '@/components/workout/RestTimer';
import { WorkoutSummaryDialog } from '@/components/workout/WorkoutSummaryDialog';
import { Dialog } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import type { WorkoutExercise } from '@/lib/types/workout';
import { Dumbbell, Flag } from 'lucide-react';

interface LogState {
    weightKg: string;
    reps: string;
    completed: boolean;
    pending: boolean;
}

const keyOf = (exerciseId: string, setNumber: number) => `${exerciseId}__${setNumber}`;

export default function WorkoutSessionPage() {
    const params = useParams<{ sessionId: string }>();
    const sessionId = params?.sessionId ?? '';
    const router = useRouter();

    const active = useActiveSessionStore((s) => s.active);
    const clear = useActiveSessionStore((s) => s.clear);
    const hasHydrated = useActiveSessionStore((s) => s._hasHydrated);

    const { data: program, isLoading, isError, error, refetch } = useProgram(
        active?.programId ?? ''
    );
    const addSet = useAddSet(sessionId);
    const completeSession = useCompleteSession(sessionId);

    const [logs, setLogs] = useState<Record<string, LogState>>({});
    const [rest, setRest] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [finished, setFinished] = useState(false);
    const [summary, setSummary] = useState<{
        completedSets: number;
        totalSets: number;
        totalVolumeKg: number;
        durationSeconds: number;
    } | null>(null);

    const [now, setNow] = useState<number>(() => Date.now());

    // Redirect if no matching active session (only after store rehydration).
    useEffect(() => {
        if (!hasHydrated || finished) return;
        if (!active || active.sessionId !== sessionId) {
            router.replace('/programs');
        }
    }, [hasHydrated, active, sessionId, finished, router]);

    // Elapsed timer.
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // Rest countdown.
    useEffect(() => {
        if (rest === null || rest <= 0) return;
        const t = setTimeout(() => {
            setRest((r) => (r === null || r <= 1 ? null : r - 1));
        }, 1000);
        return () => clearTimeout(t);
    }, [rest]);

    const day = useMemo(
        () => program?.workoutDays.find((d) => d.id === active?.workoutDayId) ?? null,
        [program, active]
    );

    const totalSets = useMemo(
        () => (day ? day.exercises.reduce((sum, ex) => sum + ex.sets, 0) : 0),
        [day]
    );

    const completedSets = useMemo(
        () => Object.values(logs).filter((l) => l.completed).length,
        [logs]
    );

    const pct = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;

    const elapsedSeconds = useMemo(() => {
        if (!active?.startedAt) return 0;
        return Math.max(0, Math.floor((now - new Date(active.startedAt).getTime()) / 1000));
    }, [active, now]);

    const derivePrefill = (exerciseId: string, setNumber: number): { weightKg: string; reps: string } => {
        let best: LogState | null = null;
        for (let n = setNumber - 1; n >= 1; n--) {
            const cand = logs[keyOf(exerciseId, n)];
            if (cand?.completed) {
                best = cand;
                break;
            }
        }
        return best ? { weightKg: best.weightKg, reps: best.reps } : { weightKg: '', reps: '' };
    };

    const getEntry = (exerciseId: string, setNumber: number): LogState => {
        const key = keyOf(exerciseId, setNumber);
        const existing = logs[key];
        if (existing) return existing;
        return { ...derivePrefill(exerciseId, setNumber), completed: false, pending: false };
    };

    const updateField = (exerciseId: string, setNumber: number, field: 'weightKg' | 'reps', value: string) => {
        const key = keyOf(exerciseId, setNumber);
        setLogs((p) => {
            const cur = p[key] ?? { ...derivePrefill(exerciseId, setNumber), completed: false, pending: false };
            return { ...p, [key]: { ...cur, [field]: value, pending: false } };
        });
    };

    const handleCheck = (exercise: WorkoutExercise, setNumber: number) => {
        const entry = getEntry(exercise.exerciseId, setNumber);
        const key = keyOf(exercise.exerciseId, setNumber);
        const req = {
            exerciseId: exercise.exerciseId,
            setNumber,
            weightKg: Number(entry.weightKg || 0),
            reps: Number(entry.reps || 0),
            completed: true as const,
        };

        // Optimistic local update.
        setLogs((p) => ({
            ...p,
            [key]: { ...entry, completed: true, pending: true },
        }));

        addSet.mutate(req, {
            onError: () => {
                setLogs((p) => {
                    const cur = p[key];
                    return {
                        ...p,
                        [key]: { ...(cur ?? entry), completed: cur?.completed ?? false, pending: false },
                    };
                });
            },
            onSuccess: () => {
                setLogs((p) => ({
                    ...p,
                    [key]: { ...(p[key] ?? entry), completed: true, pending: false },
                }));
                setRest(exercise.restSeconds);
            },
        });
    };

    const handleFinish = () => {
        const durationSeconds = active?.startedAt
            ? Math.max(0, Math.floor((Date.now() - new Date(active.startedAt).getTime()) / 1000))
            : 0;
        const totalVolumeKg = Object.values(logs)
            .filter((l) => l.completed)
            .reduce((sum, l) => sum + (Number(l.reps) || 0) * (Number(l.weightKg) || 0), 0);

        completeSession.mutate(undefined, {
            onSuccess: () => {
                setSummary({ completedSets, totalSets, totalVolumeKg, durationSeconds });
                setFinished(true);
                clear();
            },
            onError: () => {
                setConfirmOpen(false);
            },
        });
    };

    if (finished && summary) {
        return (
            <WorkoutSummaryDialog
                open
                completedSets={summary.completedSets}
                totalSets={summary.totalSets}
                totalVolumeKg={summary.totalVolumeKg}
                durationSeconds={summary.durationSeconds}
                onDone={() => router.push('/programs')}
            />
        );
    }

    if (!hasHydrated) {
        return (
            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        );
    }

    if (!active || active.sessionId !== sessionId) {
        return (
            <div className="mx-auto max-w-2xl p-4">
                <EmptyState
                    icon={<Dumbbell className="h-10 w-10" />}
                    title="Сессия не найдена"
                    description="Возможно, тренировка уже завершена или ссылка устарела."
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-2xl space-y-4 p-4">
                <div className="h-16 animate-pulse rounded-xl bg-gray-200" />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-2xl p-4">
                <ErrorState message={extractError(error)} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!day) {
        return (
            <div className="mx-auto max-w-2xl p-4">
                <EmptyState
                    icon={<Dumbbell className="h-10 w-10" />}
                    title="День не найден"
                    description="Не удалось загрузить упражнения для этой тренировки."
                />
            </div>
        );
    }

    const orderedExercises = [...day.exercises].sort((a, b) => a.position - b.position);

    return (
        <div className="pb-28">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div className="mx-auto max-w-2xl">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-gray-900">{day.title}</h1>
                            <p className="text-xs text-gray-500">
                                {completedSets}/{totalSets} подходов · {formatDuration(elapsedSeconds)}
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="lg"
                            onClick={() => setConfirmOpen(true)}
                            disabled={completeSession.isPending}
                        >
                            <Flag className="h-4 w-4" /> Завершить
                        </Button>
                    </div>
                    <Progress value={pct} className="mt-3" />
                </div>
            </header>

            {/* Exercise list */}
            <div className="mx-auto max-w-2xl space-y-4 p-4">
                {orderedExercises.map((ex) => (
                    <SessionExerciseCard
                        key={ex.id}
                        exercise={ex}
                        logs={logs}
                        getEntry={getEntry}
                        onField={updateField}
                        onCheck={handleCheck}
                    />
                ))}
            </div>

            {/* Floating rest timer */}
            {rest !== null && (
                <RestTimer
                    seconds={rest}
                    onAddMinute={() => setRest((r) => (r === null ? null : r + 60))}
                    onSkip={() => setRest(null)}
                />
            )}

            {/* Finish confirmation */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Завершить тренировку?"
                description={`Вы выполнили ${completedSets} из ${totalSets} подходов. Сохранить прогресс и закрыть сессию?`}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleFinish}
                            disabled={completeSession.isPending}
                        >
                            {completeSession.isPending ? 'Завершение...' : 'Завершить'}
                        </Button>
                    </>
                }
            />
        </div>
    );
}

function SessionExerciseCard({
    exercise,
    logs,
    getEntry,
    onField,
    onCheck,
}: {
    exercise: WorkoutExercise;
    logs: Record<string, LogState>;
    getEntry: (exerciseId: string, setNumber: number) => LogState;
    onField: (exerciseId: string, setNumber: number, field: 'weightKg' | 'reps', value: string) => void;
    onCheck: (exercise: WorkoutExercise, setNumber: number) => void;
}) {
    const { data } = useExerciseById(exercise.exerciseId);

    return (
        <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-sm font-semibold text-gray-900">
                    {data?.name ?? 'Упражнение'}
                </p>
                <p className="text-xs text-gray-500">
                    {exercise.sets} × {exercise.repsMin}–{exercise.repsMax} · отдых{' '}
                    {exercise.restSeconds} с
                </p>
            </div>
            <div className="space-y-2 p-3">
                {Array.from({ length: exercise.sets }, (_, i) => i + 1).map((n) => {
                    const entry = getEntry(exercise.exerciseId, n);
                    const completed = !!logs[keyOf(exercise.exerciseId, n)]?.completed || entry.completed;
                    return (
                        <SetRow
                            key={n}
                            setNumber={n}
                            weightKg={entry.weightKg}
                            reps={entry.reps}
                            completed={completed}
                            pending={entry.pending}
                            onWeightChange={(v) => onField(exercise.exerciseId, n, 'weightKg', v)}
                            onRepsChange={(v) => onField(exercise.exerciseId, n, 'reps', v)}
                            onCheck={() => onCheck(exercise, n)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function extractError(err: unknown): string {
    const e = err as { response?: { data?: { detail?: string; message?: string } } };
    return (
        e?.response?.data?.detail ??
        e?.response?.data?.message ??
        'Не удалось загрузить тренировку.'
    );
}
