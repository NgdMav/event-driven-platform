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

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(1, 'Введите пароль'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginForm) => {
        try {
            setServerError('');
            const res = await authClient.login(data.email, data.password);
            setAuth(res.accessToken, res.refreshToken);
            router.push('/exercises');
        } catch (err) {
            setServerError(extractError(err));
        }
    };

    return (
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Вход в FitPlatform
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
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
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <Link href="/register" className="font-medium text-blue-600 hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
        </div>
    );
}
