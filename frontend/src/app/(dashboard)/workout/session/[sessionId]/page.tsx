'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import { Spinner } from '@/components/Spinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useToast } from '@/components/ui/toast';
import { useSession, useCompleteSession } from '@/hooks/useWorkout';
import { workoutClient } from '@/lib/api/clients/workout';
import type { LogSetRequest } from '@/lib/workout-types';
import { cn } from '@/lib/utils';
import { Check, Clock, Dumbbell, Flag } from 'lucide-react';

interface SetLog {
    weightKg: string;
    reps: string;
    completed: boolean;
    pending: boolean;
}

const REST_SECONDS = 90;

export default function WorkoutSessionPage() {
    const params = useParams<{ sessionId: string }>();
    const sessionId = params?.sessionId ?? '';
    const router = useRouter();
    const { toast } = useToast();

    const { data, isLoading, isError, error, refetch } = useSession(sessionId);
    const queryClient = useQueryClient();
    const [logs, setLogs] = useState<Record<string, SetLog>>({});
    const logsRef = useRef<Record<string, SetLog>>({});
    const defaultsRef = useRef<Record<string, SetLog>>({});

    useEffect(() => {
        logsRef.current = logs;
    }, [logs]);

    // Pre-compute per-set defaults from the session (ref-only, no setState).
    useEffect(() => {
        if (!data) return;
        const d: Record<string, SetLog> = {};
        data.exercises.forEach((ex) =>
            ex.sets.forEach((s) => {
                d[`${ex.exerciseId}__${s.setNumber}`] = {
                    weightKg: s.targetWeightKg != null ? String(s.targetWeightKg) : '',
                    reps: s.targetReps ?? '',
                    completed: false,
                    pending: false,
                };
            })
        );
        defaultsRef.current = d;
    }, [data]);

    const logMutation = useMutation<void, Error, LogSetRequest, { prev?: SetLog }>({
        mutationFn: (req) => workoutClient.logSet(sessionId, req).then(() => undefined),
        onMutate: (variables) => {
            const key = `${variables.exerciseId}__${variables.setNumber}`;
            const prev = logsRef.current[key] ?? defaultsRef.current[key];
            const base = logsRef.current[key] ?? defaultsRef.current[key] ?? {
                weightKg: '',
                reps: '',
                completed: false,
                pending: false,
            };
            setLogs((p) => ({ ...p, [key]: { ...base, completed: true, pending: true } }));
            return { prev };
        },
        onError: (_e, variables, ctx) => {
            const key = `${variables.exerciseId}__${variables.setNumber}`;
            const base = logsRef.current[key] ?? defaultsRef.current[key] ?? {
                weightKg: '',
                reps: '',
                completed: false,
                pending: false,
            };
            setLogs((p) => ({
                ...p,
                [key]: ctx?.prev ?? { ...base, completed: false, pending: false },
            }));
            toast('Не удалось сохранить подход', 'error');
        },
        onSuccess: (_data, variables) => {
            const key = `${variables.exerciseId}__${variables.setNumber}`;
            setLogs((p) => ({ ...p, [key]: { ...(p[key] ?? {}), pending: false } }));
            toast('Подход сохранён!', 'success');
            setRest(REST_SECONDS);
            void queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
        },
    });
    const completeSession = useCompleteSession(sessionId);

    const [rest, setRest] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Rest countdown
    useEffect(() => {
        if (rest === null) return;
        if (rest <= 0) {
            setRest(null);
            return;
        }
        const t = setTimeout(() => setRest((r) => (r === null ? null : r - 1)), 1000);
        return () => clearTimeout(t);
    }, [rest]);

    const { total, done, pct } = useMemo(() => {
        let total = 0;
        let done = 0;
        if (data) {
            data.exercises.forEach((ex) =>
                ex.sets.forEach((s) => {
                    total += 1;
                    if (logs[`${ex.exerciseId}__${s.setNumber}`]?.completed) done += 1;
                })
            );
        }
        return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    }, [data, logs]);

    const isCompleted = data?.status === 'COMPLETED' || data?.status === 'DONE';

    const handleCheck = (exerciseId: string, setNumber: number, current: SetLog) => {
        if (current.completed) return;

        const request: LogSetRequest = {
            exerciseId,
            setNumber,
            weightKg: Number(current.weightKg),
            reps: Number(current.reps),
            completed: true,
        };

        logMutation.mutate(request);
    };

    const handleComplete = () => {
        completeSession.mutate(undefined, {
            onSuccess: () => {
                toast('Тренировка завершена!', 'success');
                router.push('/profile');
            },
            onError: () => {
                toast('Не удалось завершить тренировку', 'error');
                setConfirmOpen(false);
            },
        });
    };

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

    if (!data) {
        return (
            <div className="mx-auto max-w-2xl p-4">
                <EmptyState
                    icon={<Dumbbell className="h-10 w-10" />}
                    title="Сессия не найдена"
                    description="Возможно, ссылка устарела или тренировка уже удалена."
                />
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="mx-auto max-w-2xl p-4">
                <EmptyState
                    icon={<Check className="h-10 w-10" />}
                    title="Тренировка завершена"
                    description="Отличная работа! Прогресс уже сохранён."
                    action={
                        <Button onClick={() => router.push('/profile')}>К профилю</Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="pb-28">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div className="mx-auto max-w-2xl">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-gray-900">
                                {data.dayTitle}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {done}/{total} подходов · {pct}%
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
                {data.exercises.length === 0 ? (
                    <EmptyState
                        icon={<Dumbbell className="h-10 w-10" />}
                        title="Нет упражнений"
                        description="В этой тренировке пока нет запланированных упражнений."
                    />
                ) : (
                    data.exercises.map((ex) => (
                        <Card key={ex.exerciseId}>
                            <CardHeader>
                                <CardTitle>{ex.name}</CardTitle>
                                <p className="text-sm text-gray-500">{ex.targetMuscleGroup}</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {ex.sets.map((s) => {
                                    const key = `${ex.exerciseId}__${s.setNumber}`;
                                    const base: SetLog = {
                                        weightKg: s.targetWeightKg != null ? String(s.targetWeightKg) : '',
                                        reps: s.targetReps ?? '',
                                        completed: false,
                                        pending: false,
                                    };
                                    const entry = logs[key] ? { ...base, ...logs[key] } : base;
                                    const target = [
                                        s.targetWeightKg != null ? `${s.targetWeightKg} кг` : null,
                                        s.targetReps ? `${s.targetReps} повт.` : null,
                                    ]
                                        .filter(Boolean)
                                        .join(' · ');

                                    return (
                                        <div
                                            key={key}
                                            className={cn(
                                                'rounded-lg border p-3',
                                                entry?.completed
                                                    ? 'border-emerald-300 bg-emerald-50'
                                                    : 'border-gray-200'
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    Подход {s.setNumber}
                                                </span>
                                                {target && (
                                                    <span className="text-xs text-gray-500">
                                                        {target}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-xs">Вес (кг)</Label>
                                                    <Input
                                                        type="number"
                                                        inputMode="decimal"
                                                        disabled={entry?.completed}
                                                        value={entry?.weightKg ?? ''}
                                                        onChange={(e) =>
                                                            setLogs((p) => ({
                                                                ...p,
                                                                [key]: {
                                                                    ...base,
                                                                    ...p[key],
                                                                    weightKg: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Повторения</Label>
                                                    <Input
                                                        type="number"
                                                        inputMode="numeric"
                                                        disabled={entry?.completed}
                                                        value={entry?.reps ?? ''}
                                                        onChange={(e) =>
                                                            setLogs((p) => ({
                                                                ...p,
                                                                [key]: {
                                                                    ...base,
                                                                    ...p[key],
                                                                    reps: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCheck(ex.exerciseId, s.setNumber, entry)
                                                }
                                                disabled={entry?.completed || entry?.pending}
                                                className={cn(
                                                    'mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition active:scale-[0.99]',
                                                    entry?.completed
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                                )}
                                            >
                                                {entry?.pending ? (
                                                    <Spinner className="h-4 w-4 text-white" />
                                                ) : entry?.completed ? (
                                                    <>
                                                        <Check className="h-4 w-4" /> Выполнено
                                                    </>
                                                ) : (
                                                    'Отметить выполненным'
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Floating rest timer */}
            {rest !== null && (
                <div className="fixed inset-x-0 bottom-0 z-40 p-4">
                    <div className="mx-auto flex max-w-2xl items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white shadow-lg">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span className="font-semibold">Отдых: {rest} с</span>
                        </div>
                        <button
                            onClick={() => setRest(null)}
                            className="text-sm text-gray-300 underline"
                        >
                            Пропустить
                        </button>
                    </div>
                </div>
            )}

            {/* Finish confirmation */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="Завершить тренировку?"
                description={`Вы выполнили ${done} из ${total} подходов. Сохранить прогресс и закрыть сессию?`}
                footer={
                    <>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleComplete}
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

function extractError(err: unknown): string {
    const e = err as { response?: { data?: { detail?: string; message?: string } } };
    return (
        e?.response?.data?.detail ??
        e?.response?.data?.message ??
        'Не удалось загрузить сессию.'
    );
}
