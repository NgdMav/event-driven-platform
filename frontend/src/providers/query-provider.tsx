'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { AxiosError } from 'axios';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                gcTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
                retry: (failureCount, error) => {
                    const status = (error as AxiosError)?.response?.status;
                    if (status === 401 || status === 403 || status === 404) return false;
                    return failureCount < 2;
                },
                retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
            },
            mutations: {
                retry: false,
            },
        },
    }));

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
