'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { AppShell } from '@/components/layout/AppShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const accessToken = useAuthStore((s) => s.accessToken);

    useEffect(() => {
        if (!accessToken && pathname !== '/login' && pathname !== '/register') {
            router.push('/login');
        }
    }, [accessToken, pathname, router]);

    if (!accessToken) return null;

    return <AppShell>{children}</AppShell>;
}
