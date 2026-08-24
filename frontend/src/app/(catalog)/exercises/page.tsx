'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Dumbbell } from 'lucide-react';
import { useExercises, type ExerciseFilters } from '@/hooks/useExercises';
import { useDebounce } from '@/hooks/useDebounce';
import {
    DIFFICULTIES,
    DIFFICULTY_LABELS,
    EQUIPMENT,
    EQUIPMENT_LABELS,
    MUSCLE_GROUPS,
    MUSCLE_GROUP_LABELS,
    type Difficulty,
    type Equipment,
    type MuscleGroup,
} from '@/lib/types';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Spinner } from '@/components/Spinner';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { useQueryClient } from '@tanstack/react-query';

export default function ExercisesPage() {
    const queryClient = useQueryClient();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 350);
    const [muscle, setMuscle] = useState<MuscleGroup | ''>('');
    const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
    const [equipment, setEquipment] = useState<Equipment | ''>('');

    const filters = useMemo<ExerciseFilters>(
        () => ({ search: debouncedSearch, muscle, difficulty, equipment }),
        [debouncedSearch, muscle, difficulty, equipment]
    );

    const { data: exercises, isLoading, isError, error } = useExercises(filters);

    const clearAll = () => {
        setSearchInput('');
        setMuscle('');
        setDifficulty('');
        setEquipment('');
    };

    const hasActiveFilters = !!(
        muscle ||
        difficulty ||
        equipment ||
        searchInput.trim()
    );

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Каталог упражнений</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Найдите упражнение по названию, группе мышц, сложности или инвентарю.
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Поиск упражнения..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-3 pl-10 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <SlidersHorizontal size={16} />
                    Фильтры
                </div>
                <Select
                    value={muscle}
                    onChange={(v) => setMuscle(v as MuscleGroup | '')}
                    placeholder="Все мышцы"
                    options={MUSCLE_GROUPS.map((m) => ({ value: m, label: MUSCLE_GROUP_LABELS[m] }))}
                />
                <Select
                    value={difficulty}
                    onChange={(v) => setDifficulty(v as Difficulty | '')}
                    placeholder="Любая сложность"
                    options={DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABELS[d] }))}
                />
                <Select
                    value={equipment}
                    onChange={(v) => setEquipment(v as Equipment | '')}
                    placeholder="Любой инвентарь"
                    options={EQUIPMENT.map((e) => ({ value: e, label: EQUIPMENT_LABELS[e] }))}
                />
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="ml-auto text-sm font-medium text-blue-600 hover:underline"
                    >
                        Сбросить
                    </button>
                )}
            </div>

            {/* States */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Spinner className="h-8 w-8 text-blue-500" />
                </div>
            ) : isError ? (
                <ErrorState message={extractErrorSafe(error)} onRetry={() => queryClient.invalidateQueries({ queryKey: ['exercises'] })} />
            ) : !exercises || exercises.length === 0 ? (
                <EmptyState
                    icon={<Dumbbell className="h-10 w-10" />}
                    title="Ничего не найдено"
                    description="Попробуйте изменить поисковый запрос или сбросить фильтры."
                    action={
                        hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Сбросить фильтры
                            </button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exercises.map((ex) => (
                        <ExerciseCard key={ex.id} exercise={ex} />
                    ))}
                </div>
            )}
        </div>
    );
}

function Select({
    value,
    onChange,
    placeholder,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-300 p-2 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}

function extractErrorSafe(error: unknown): string {
    const err = error as { response?: { data?: { detail?: string; message?: string } } };
    return err?.response?.data?.detail ?? err?.response?.data?.message ?? 'Не удалось загрузить упражнения.';
}
