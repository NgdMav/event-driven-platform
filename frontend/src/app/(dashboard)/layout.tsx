'use client';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User, Dumbbell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { accessToken, clearTokens } = useAuthStore();

    useEffect(() => {
        if (!accessToken && pathname !== '/login' && pathname !== '/register') {
            router.push('/login');
        }
    }, [accessToken, pathname, router]);

    if (!accessToken) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex gap-6 font-semibold">
                    <Link href="/profile" className="flex items-center gap-2 hover:text-blue-600"><User size={18}/> Профиль</Link>
                    <Link href="/exercises" className="flex items-center gap-2 hover:text-blue-600"><Dumbbell size={18}/> Упражнения</Link>
                </div>
                <button onClick={() => { clearTokens(); router.push('/login'); }} className="text-red-500 flex items-center gap-2 hover:underline">
                    <LogOut size={18}/> Выйти
                </button>
            </nav>
            <main className="container mx-auto p-6">{children}</main>
        </div>
    );
}