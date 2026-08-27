'use client';

import { cn } from '@/lib/utils';
import type { WorkoutDay } from '@/lib/types/workout';

interface DayTabsProps {
    days: WorkoutDay[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export function DayTabs({ days, selectedId, onSelect }: DayTabsProps) {
    const ordered = [...days].sort((a, b) => a.dayIndex - b.dayIndex);
    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            {ordered.map((day) => {
                const active = day.id === selectedId;
                return (
                    <button
                        key={day.id}
                        type="button"
                        onClick={() => onSelect(day.id)}
                        className={cn(
                            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                            active
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
                        )}
                    >
                        День {day.dayIndex}
                    </button>
                );
            })}
        </div>
    );
}
