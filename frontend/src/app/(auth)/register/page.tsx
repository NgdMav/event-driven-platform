'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/lib/api/clients/auth';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { extractError } from '@/lib/error';

const registerSchema = z
    .object({
        email: z.string().email('Некорректный email'),
        password: z.string().min(8, 'Минимум 8 символов'),
        confirmPassword: z.string().min(8, 'Минимум 8 символов'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setServerError('');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword: _confirmPassword, ...payload } = data;
            const res = await authClient.register(payload.email, payload.password);
            setAuth(res.accessToken, res.refreshToken);
            router.push('/exercises');
        } catch (err) {
            setServerError(extractError(err));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Регистрация в FitPlatform
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            autoComplete="email"
                            placeholder="your@email.com"
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Пароль</label>
                        <input
                            {...register('password')}
                            type="password"
                            autoComplete="new-password"
                            placeholder="Минимум 8 символов"
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Подтвердить пароль
                        </label>
                        <input
                            {...register('confirmPassword')}
                            type="password"
                            autoComplete="new-password"
                            placeholder="Повторите пароль"
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-center text-sm font-medium text-red-600">{serverError}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 p-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Уже есть аккаунт?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}
