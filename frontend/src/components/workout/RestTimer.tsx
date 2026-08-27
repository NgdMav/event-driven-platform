'use client';

import { Clock, Plus, X } from 'lucide-react';

interface RestTimerProps {
    seconds: number;
    onAddMinute: () => void;
    onSkip: () => void;
}

function format(total: number): string {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function RestTimer({ seconds, onAddMinute, onSkip }: RestTimerProps) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 p-4">
            <div className="mx-auto flex max-w-2xl items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white shadow-lg">
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Отдых: {format(seconds)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onAddMinute}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
                    >
                        <Plus className="h-3.5 w-3.5" /> +1 мин
                    </button>
                    <button
                        type="button"
                        onClick={onSkip}
                        className="inline-flex items-center gap-1 text-sm text-gray-300 underline"
                    >
                        <X className="h-3.5 w-3.5" /> Пропустить
                    </button>
                </div>
            </div>
        </div>
    );
}
