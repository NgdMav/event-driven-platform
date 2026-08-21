'use client';
import { api } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function ProfilePage() {
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/profile/me');
            return res.data;
        },
    });

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    const mutation = useMutation({
        mutationFn: (data: any) => api.put('/profile/me', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            alert('Профиль обновлен!');
        },
    });

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input {...register('firstName')} placeholder="Имя" className="p-2 border rounded" />
                    <input {...register('lastName')} placeholder="Фамилия" className="p-2 border rounded" />
                    <input {...register('heightCm')} type="number" placeholder="Рост (см)" className="p-2 border rounded" />
                    <input {...register('weightKg')} type="number" step="0.1" placeholder="Вес (кг)" className="p-2 border rounded" />
                    <select {...register('goal')} className="p-2 border rounded">
                        <option value="MUSCLE_GAIN">Набор массы</option>
                        <option value="FAT_LOSS">Похудение</option>
                        <option value="GENERAL_FITNESS">Тонус</option>
                    </select>
                    <select {...register('experienceLevel')} className="p-2 border rounded">
                        <option value="BEGINNER">Новичок</option>
                        <option value="INTERMEDIATE">Средний</option>
                        <option value="ADVANCED">Продвинутый</option>
                    </select>
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </button>
            </form>
        </div>
    );
}