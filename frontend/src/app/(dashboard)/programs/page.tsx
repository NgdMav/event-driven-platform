'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrograms } from '@/hooks/use-programs';
import { ProgramCard } from '@/components/workout/ProgramCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function ProgramsPage() {
    const router = useRouter();
    const { data, isLoading, isError, error, refetch } = usePrograms();

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Программы</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Ваши планы тренировок по дням и упражнениям.
                    </p>
                </div>
                <Button onClick={() => router.push('/workout/recommend')}>
                    <Sparkles className="h-4 w-4" /> Создать
                </Button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-36 animate-pulse rounded-xl bg-gray-200" />
                    ))}
                </div>
            )}

            {isError && (
                <ErrorState
                    message={extractError(error)}
                    onRetry={() => refetch()}
                />
            )}

            {!isLoading && !isError && data && data.length === 0 && (
                <EmptyState
                    icon={<Sparkles className="h-10 w-10" />}
                    title="Пока нет программ"
                    description="Сгенерируйте персональную программу на основе ваших целей."
                    action={
                        <Link href="/workout/recommend">
                            <Button>
                                <Sparkles className="h-4 w-4" /> Создать первую программу
                            </Button>
                        </Link>
                    }
                />
            )}

            {!isLoading && !isError && data && data.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {data.map((program) => (
                        <ProgramCard key={program.id} program={program} />
                    ))}
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
        'Не удалось загрузить программы.'
    );
}
