import { api } from '@/lib/api';
import type { AuthResponse, CurrentUser, MessageResponse } from '@/lib/types';

export const authClient = {
    register: (email: string, password: string) =>
        api.post<AuthResponse>('/auth/register', { email, password }).then((r) => r.data),
    login: (email: string, password: string) =>
        api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
    logout: (refreshToken: string) =>
        api.post<MessageResponse>('/auth/logout', { refreshToken }).then((r) => r.data),
    me: () => api.get<CurrentUser>('/auth/me').then((r) => r.data),
};
