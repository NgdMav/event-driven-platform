'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dumbbell, LogOut, User, LayoutGrid, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authClient } from '@/lib/api/clients/auth';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
    { href: '/profile', label: 'Профиль', icon: User },
    { href: '/exercises', label: 'Упражнения', icon: Dumbbell },
    { href: '/programs', label: 'Мои программы', icon: LayoutGrid },
    { href: '/workout/recommend', label: 'Рекомендации', icon: Sparkles },
] as const;

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const accessToken = useAuthStore((s) => s.accessToken);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    const handleLogout = async () => {
        const refreshToken = useAuthStore.getState().refreshToken;
        try {
            if (refreshToken) {
                await authClient.logout(refreshToken);
            }
        } catch {
            // ignore network errors on logout, still clear local state
        } finally {
            clearAuth();
            router.push('/login');
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <Link
                    href={accessToken ? '/exercises' : '/'}
                    className="flex items-center gap-2 font-bold text-gray-900"
                >
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                    FitPlatform
                </Link>

                {accessToken ? (
                    <>
                        <nav className="flex items-center gap-1 sm:gap-2">
                            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                        isActive(href)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{label}</span>
                                </Link>
                            ))}
                        </nav>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Выйти</span>
                        </button>
                    </>
                ) : (
                    <nav className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                            Войти
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Регистрация
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
