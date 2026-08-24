import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (access: string, refresh: string) => void;
    setTokens: (access: string, refresh: string) => void;
    clearAuth: () => void;
    clearTokens: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            setAuth: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
            setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
            clearAuth: () => set({ accessToken: null, refreshToken: null }),
            clearTokens: () => set({ accessToken: null, refreshToken: null }),
            isAuthenticated: () => !!get().accessToken,
        }),
        { name: 'auth-storage' }
    )
);
