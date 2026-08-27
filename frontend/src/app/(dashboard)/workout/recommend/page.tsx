'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast';
import {
    EQUIPMENT,
    EQUIPMENT_LABELS,
    EXPERIENCE_LEVELS,
    GOALS,
} from '@/lib/types';
import { useProfile } from '@/hooks/useProfile';
import { useRecommend, useGenerateProgram } from '@/hooks/useWorkout';
import type {
    ExperienceLevel,
    GenerateProgramRequest,
    ProgramRecommendationResponse,
    WorkoutGoal,
} from '@/lib/workout-types';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const recommendSchema = z.object({
    goal: z.string().min(1, 'Выберите цель'),
    experienceLevel: z.string().min(1, 'Выберите уровень'),
    daysPerWeek: z.coerce.number().int().min(1).max(6),
    availableEquipment: z.array(z.string()).min(1, 'Выберите хотя бы один инвентарь'),
    currentWeightKg: z.coerce.number().positive().optional(),
    heightCm: z.coerce.number().positive().optional(),
});

type RecommendFormValues = z.infer<typeof recommendSchema>;

export default function RecommendPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: profile } = useProfile();
    const recommend = useRecommend();
    const generate = useGenerateProgram();
    const [recommendation, setRecommendation] = useState<ProgramRecommendationResponse | null>(null);
    const [submitted, setSubmitted] = useState<RecommendFormValues | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecommendFormValues>({
        resolver: zodResolver(recommendSchema),
        defaultValues: {
            goal: '',
            experienceLevel: '',
            daysPerWeek: 3,
            availableEquipment: [],
            currentWeightKg: undefined,
            heightCm: undefined,
        },
    });

    useEffect(() => {
        if (profile) {
            reset((prev) => ({
                ...prev,
                currentWeightKg: profile.weightKg ?? undefined,
                heightCm: profile.heightCm ?? undefined,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    const onSubmit = (values: RecommendFormValues) => {
        setRecommendation(null);
        setSubmitted(values);
        recommend.mutate(
            {
                goal: values.goal as WorkoutGoal,
                experienceLevel: values.experienceLevel as ExperienceLevel,
                daysPerWeek: values.daysPerWeek,
                availableEquipment: values.availableEquipment,
                currentWeightKg: values.currentWeightKg,
                heightCm: values.heightCm,
            },
            {
                onSuccess: (data) => {
                    setRecommendation(data);
                    toast('Рекомендация готова!', 'success');
                },
                onError: () => toast('Не удалось получить рекомендацию', 'error'),
            }
        );
    };

    const handleGenerate = () => {
        if (!submitted) return;
        const payload: GenerateProgramRequest = {
            goal: submitted.goal as WorkoutGoal,
            experienceLevel: submitted.experienceLevel as ExperienceLevel,
            daysPerWeek: submitted.daysPerWeek,
        };
        generate.mutate(payload, {
            onSuccess: (program) => {
                toast('Программа создана — погнали!', 'success');
                router.push(`/programs/${program.id}`);
            },
            onError: () => toast('Не удалось создать программу', 'error'),
        });
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Подбор программы</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Расскажите о себе — и мы предложим персональную программу тренировок.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Параметры</CardTitle>
                    <CardDescription>Используются для генерации рекомендации.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="goal">Цель</Label>
                                <Select id="goal" {...register('goal')}>
                                    <option value="">Выберите цель</option>
                                    {GOALS.map((g) => (
                                        <option key={g.value} value={g.value}>
                                            {g.label}
                                        </option>
                                    ))}
                                </Select>
                                {errors.goal && (
                                    <p className="mt-1 text-sm text-red-500">{errors.goal.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="experienceLevel">Уровень опыта</Label>
                                <Select id="experienceLevel" {...register('experienceLevel')}>
                                    <option value="">Выберите уровень</option>
                                    {EXPERIENCE_LEVELS.map((e) => (
                                        <option key={e.value} value={e.value}>
                                            {e.label}
                                        </option>
                                    ))}
                                </Select>
                                {errors.experienceLevel && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.experienceLevel.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="daysPerWeek">Дней в неделю</Label>
                                <Select id="daysPerWeek" {...register('daysPerWeek')}>
                                    {[1, 2, 3, 4, 5, 6].map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </Select>
                                {errors.daysPerWeek && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.daysPerWeek.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="currentWeightKg">Текущий вес (кг)</Label>
                                <Input
                                    id="currentWeightKg"
                                    type="number"
                                    step="0.1"
                                    placeholder="напр. 75"
                                    {...register('currentWeightKg')}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Label htmlFor="heightCm">Рост (см)</Label>
                                <Input
                                    id="heightCm"
                                    type="number"
                                    step="0.1"
                                    placeholder="напр. 180"
                                    {...register('heightCm')}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Доступный инвентарь</Label>
                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {EQUIPMENT.map((eq) => (
                                    <label
                                        key={eq}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 p-2.5 text-sm"
                                    >
                                        <Checkbox value={eq} {...register('availableEquipment')} />
                                        <span>{EQUIPMENT_LABELS[eq]}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.availableEquipment && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.availableEquipment.message as string}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="submit" disabled={recommend.isPending} className="w-full sm:w-auto">
                            {recommend.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Анализируем...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" /> Получить рекомендацию
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {recommend.isError && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    Не удалось получить рекомендацию. Попробуйте ещё раз.
                </p>
            )}

            {recommendation && (
                <Card className="mt-6 border-emerald-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" /> Рекомендованная программа
                        </CardTitle>
                        <CardDescription>
                            {recommendation.name ??
                                `Шаблон ${recommendation.programTemplateId}`}{' '}
                            · уверенность {Math.round(recommendation.confidence * 100)}%
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recommendation.reasons.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">Почему это подходит</h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                                    {recommendation.reasons.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {recommendation.suggestedFocus.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">Акцент программы</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {recommendation.suggestedFocus.map((f) => (
                                        <span
                                            key={f}
                                            className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleGenerate}
                            disabled={generate.isPending}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
                        >
                            {generate.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Создаём...
                                </>
                            ) : (
                                'Сгенерировать и начать программу'
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
