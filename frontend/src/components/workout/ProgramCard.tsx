import Link from 'next/link';
import {
    PROGRAM_GOAL_LABELS,
    PROGRAM_STATUS_LABELS,
    PROGRAM_STATUS_VARIANT,
    type Program,
} from '@/lib/types/workout';
import { CalendarDays, Dumbbell, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProgramCard({ program }: { program: Program }) {
    return (
        <Link
            href={`/programs/${program.id}`}
            className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">
                    {program.name}
                </h3>
                <span
                    className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                        PROGRAM_STATUS_VARIANT[program.status]
                    )}
                >
                    {PROGRAM_STATUS_LABELS[program.status]}
                </span>
            </div>

            <p className="mt-1 text-sm text-blue-600">
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

            <p className="mt-3 text-xs text-gray-400">Создана {formatDate(program.createdAt)}</p>
        </Link>
    );
}
