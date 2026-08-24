'use client';

import { useQuery } from '@tanstack/react-query';
import { authClient } from '@/lib/api/clients/auth';
import { useAuthStore } from '@/store/auth-store';

export function useCurrentUser() {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authClient.me,
        enabled: !!accessToken,
        staleTime: 5 * 60 * 1000,
    });
}
