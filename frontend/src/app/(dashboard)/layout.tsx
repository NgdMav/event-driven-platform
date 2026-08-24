'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, Dumbbell, Sparkles } from 'lucide-react';
import { authClient } from '@/lib/api/clients/auth';
import { useCurrentUser } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken, clearAuth, refreshToken } = useAuthStore();
    const { data: user } = useCurrentUser();

    useEffect(() => {
        if (!accessToken && pathname !== '/login' && pathname !== '/register') {
            router.push('/login');
        }
    }, [accessToken, pathname, router]);

    if (!accessToken) return null;

    const handleLogout = async () => {
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
        <div className="min-h-screen bg-gray-100">
            <nav className="flex items-center justify-between bg-white p-4 shadow">
                <div className="flex gap-6 font-semibold">
                    <Link href="/profile" className="flex items-center gap-2 hover:text-blue-600">
                        <User size={18} /> Профиль
                    </Link>
                    <Link href="/exercises" className="flex items-center gap-2 hover:text-blue-600">
                        <Dumbbell size={18} /> Упражнения
                    </Link>
                    <Link href="/workout/recommend" className="flex items-center gap-2 hover:text-blue-600">
                        <Sparkles size={18} /> Программа
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {user?.UserId && (
                        <span className="text-sm text-gray-500">ID: {user.UserId.slice(0, 8)}</span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:underline"
                    >
                        <LogOut size={18} /> Выйти
                    </button>
                </div>
            </nav>
            <main className="container mx-auto p-6">{children}</main>
        </div>
    );
}
