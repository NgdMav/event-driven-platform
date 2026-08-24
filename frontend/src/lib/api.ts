import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth-store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export const api = axios.create({
    baseURL: BASE_URL,
});

const UNAUTHENTICATED_PATHS = ['/auth/login', '/auth/register'];

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: AxiosError | null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
    failedQueue = [];
}

function redirectToLogin() {
    if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/register') {
            // Interceptor has no router context; hard redirect is intentional here.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign('/login');
        }
    }
}

const refreshHttpClient = axios.create({ baseURL: BASE_URL });

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableConfig | undefined;
        const status = error.response?.status;

        if (!originalRequest || status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const url = originalRequest.url ?? '';
        if (UNAUTHENTICATED_PATHS.some((p) => url.includes(p))) {
            useAuthStore.getState().clearAuth();
            redirectToLogin();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => api(originalRequest))
                .catch((e) => Promise.reject(e));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
            isRefreshing = false;
            useAuthStore.getState().clearAuth();
            redirectToLogin();
            return Promise.reject(error);
        }

        try {
            const { data } = await refreshHttpClient.post<{
                accessToken: string;
                refreshToken: string;
                expiresIn: number;
            }>('/auth/refresh', { refreshToken });

            useAuthStore.getState().setAuth(data.accessToken, data.refreshToken);
            processQueue(null);

            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            useAuthStore.getState().clearAuth();
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
