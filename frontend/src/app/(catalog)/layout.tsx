'use client';

import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
    const accessToken = useAuthStore((s) => s.accessToken);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
                        <Dumbbell className="h-5 w-5 text-emerald-500" />
                        FitPlatform
                    </Link>
                    <nav className="flex items-center gap-4 text-sm font-medium">
                        <Link href="/exercises" className="text-gray-700 hover:text-emerald-600">
                            Каталог
                        </Link>
                        {accessToken ? (
                            <Link href="/profile" className="text-gray-700 hover:text-emerald-600">
                                Профиль
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-emerald-600">
                                    Войти
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-emerald-500 px-4 py-1.5 text-white transition-colors hover:bg-emerald-600"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl p-6">{children}</main>
        </div>
    );
}
