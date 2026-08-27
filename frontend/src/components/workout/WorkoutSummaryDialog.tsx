'use client';

import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkoutSummaryDialogProps {
    open: boolean;
    completedSets: number;
    totalSets: number;
    totalVolumeKg: number;
    durationSeconds: number;
    onDone: () => void;
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}ч ${m}м ${s}с`;
    if (m > 0) return `${m}м ${s}с`;
    return `${s}с`;
}

export function WorkoutSummaryDialog({
    open,
    completedSets,
    totalSets,
    totalVolumeKg,
    durationSeconds,
    onDone,
}: WorkoutSummaryDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden />
            <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Тренировка завершена!</h2>
                <p className="mt-1 text-sm text-gray-500">Отличная работа в зале.</p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-lg font-bold text-gray-900">
                            {completedSets}/{totalSets}
                        </p>
                        <p className="text-xs text-gray-500">подходов</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-lg font-bold text-gray-900">
                            {totalVolumeKg.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-500">кг объём</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-lg font-bold text-gray-900">
                            {formatDuration(durationSeconds)}
                        </p>
                        <p className="text-xs text-gray-500">время</p>
                    </div>
                </div>

                <Button onClick={onDone} className="mt-6 w-full">
                    К программам
                </Button>
            </div>
        </div>
    );
}
