'use client';

import { useEffect, useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import {
    ACTIVITY_LEVELS,
    EXPERIENCE_LEVELS,
    GOALS,
    PRIVACY_OPTIONS,
    SEX_OPTIONS,
} from '@/lib/types';
import { extractError } from '@/lib/error';
import { Spinner } from '@/components/Spinner';
import { ErrorState } from '@/components/ErrorState';

const profileSchema = z.object({
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    birthDate: z.string().optional(),
    sex: z.string().optional(),
    heightCm: z.string().optional(),
    weightKg: z.string().optional(),
    goal: z.string().optional(),
    experienceLevel: z.string().optional(),
    activityLevel: z.string().optional(),
    timezone: z.string().optional(),
    privacyLevel: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function toInputValue(value: string | number | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
}

export default function ProfilePage() {
    const { data: profile, isLoading, isError, error, refetch } = useProfile();
    const updateMutation = useUpdateProfile();
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            birthDate: '',
            sex: '',
            heightCm: '',
            weightKg: '',
            goal: '',
            experienceLevel: '',
            activityLevel: '',
            timezone: '',
            privacyLevel: '',
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                firstName: toInputValue(profile.firstName),
                lastName: toInputValue(profile.lastName),
                birthDate: toInputValue(profile.birthDate),
                sex: toInputValue(profile.sex),
                heightCm: toInputValue(profile.heightCm),
                weightKg: toInputValue(profile.weightKg),
                goal: toInputValue(profile.goal),
                experienceLevel: toInputValue(profile.experienceLevel),
                activityLevel: toInputValue(profile.activityLevel),
                timezone: toInputValue(profile.timezone),
                privacyLevel: toInputValue(profile.privacyLevel),
            });
        }
    }, [profile, reset]);

    const onSubmit = (values: ProfileFormValues) => {
        setSuccess(false);
        const payload: Record<string, string | number> = {};
        (Object.keys(values) as (keyof ProfileFormValues)[]).forEach((key) => {
            const value = values[key];
            if (value === undefined || value === '') return;
            if (key === 'heightCm' || key === 'weightKg') {
                const num = Number(value);
                if (!Number.isNaN(num) && num > 0) payload[key] = num;
            } else {
                payload[key] = value;
            }
        });
        updateMutation.mutate(payload, {
            onSuccess: () => {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner className="h-8 w-8 text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message={extractError(error)} onRetry={() => refetch()} />;
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Мой профиль</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Имя" error={errors.firstName?.message}>
                        <input {...register('firstName')} className={inputClass} />
                    </Field>
                    <Field label="Фамилия" error={errors.lastName?.message}>
                        <input {...register('lastName')} className={inputClass} />
                    </Field>
                    <Field label="Дата рождения" error={errors.birthDate?.message}>
                        <input type="date" {...register('birthDate')} className={inputClass} />
                    </Field>
                    <Field label="Пол" error={errors.sex?.message}>
                        <Select register={register('sex')} options={SEX_OPTIONS} placeholder="Не выбрано" />
                    </Field>
                    <Field label="Рост (см)" error={errors.heightCm?.message}>
                        <input type="number" step="0.1" {...register('heightCm')} className={inputClass} />
                    </Field>
                    <Field label="Вес (кг)" error={errors.weightKg?.message}>
                        <input type="number" step="0.1" {...register('weightKg')} className={inputClass} />
                    </Field>
                    <Field label="Цель" error={errors.goal?.message}>
                        <Select register={register('goal')} options={GOALS} placeholder="Не выбрано" />
                    </Field>
                    <Field label="Уровень опыта" error={errors.experienceLevel?.message}>
                        <Select register={register('experienceLevel')} options={EXPERIENCE_LEVELS} placeholder="Не выбрано" />
                    </Field>
                    <Field label="Уровень активности" error={errors.activityLevel?.message}>
                        <Select register={register('activityLevel')} options={ACTIVITY_LEVELS} placeholder="Не выбрано" />
                    </Field>
                    <Field label="Часовой пояс" error={errors.timezone?.message}>
                        <input {...register('timezone')} placeholder="Europe/Moscow" className={inputClass} />
                    </Field>
                    <Field label="Приватность" error={errors.privacyLevel?.message}>
                        <Select register={register('privacyLevel')} options={PRIVACY_OPTIONS} placeholder="Не выбрано" />
                    </Field>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    {success && <span className="text-sm font-medium text-blue-600">Профиль обновлён</span>}
                </div>

                {updateMutation.isError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm font-medium text-red-600">
                            {extractError(updateMutation.error)}
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}

const inputClass =
    'w-full rounded-lg border border-gray-300 p-2.5 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500';

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}

function Select({
    register,
    options,
    placeholder,
}: {
    register: UseFormRegisterReturn;
    options: { value: string; label: string }[];
    placeholder: string;
}) {
    return (
        <select {...register} className={inputClass}>
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}
