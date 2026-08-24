import { api } from '@/lib/api';
import type { ProfileDto, UpdateProfileRequest } from '@/lib/types';

export const profileClient = {
    getMe: () => api.get<ProfileDto>('/profile/me').then((r) => r.data),
    update: (data: UpdateProfileRequest) =>
        api.put<ProfileDto>('/profile/me', data).then((r) => r.data),
};
