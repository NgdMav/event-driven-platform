'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileClient } from '@/lib/api/clients/profile';
import type { UpdateProfileRequest } from '@/lib/types';
import { useAuthStore } from '@/store/auth-store';

export function useProfile() {
    const accessToken = useAuthStore((s) => s.accessToken);

    return useQuery({
        queryKey: ['profile'],
        queryFn: profileClient.getMe,
        enabled: !!accessToken,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => profileClient.update(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}
