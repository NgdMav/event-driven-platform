'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/Spinner';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetRowProps {
    setNumber: number;
    weightKg: string;
    reps: string;
    completed: boolean;
    pending: boolean;
    onWeightChange: (value: string) => void;
    onRepsChange: (value: string) => void;
    onCheck: () => void;
}

export function SetRow({
    setNumber,
    weightKg,
    reps,
    completed,
    pending,
    onWeightChange,
    onRepsChange,
    onCheck,
}: SetRowProps) {
    return (
        <div
            className={cn(
                'rounded-lg border p-3 transition',
                completed
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-200 bg-white'
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Подход {setNumber}</span>
                {completed && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <Check className="h-3.5 w-3.5" /> Готово
                    </span>
                )}
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                    <Label className="text-xs">Вес (кг)</Label>
                    <Input
                        type="number"
                        inputMode="decimal"
                        disabled={completed && pending}
                        value={weightKg}
                        onChange={(e) => onWeightChange(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="text-xs">Повторения</Label>
                    <Input
                        type="number"
                        inputMode="decimal"
                        disabled={completed && pending}
                        value={reps}
                        onChange={(e) => onRepsChange(e.target.value)}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onCheck}
                disabled={completed && pending}
                className={cn(
                    'mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition active:scale-[0.99]',
                    completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                )}
            >
                {pending ? (
                    <Spinner className="h-4 w-4 text-white" />
                ) : completed ? (
                    <>
                        <Check className="h-4 w-4" /> Сохранить заново
                    </>
                ) : (
                    'Отметить'
                )}
            </button>
        </div>
    );
}
