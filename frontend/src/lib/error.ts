import type { AxiosError } from 'axios';

interface ErrorBody {
    detail?: string;
    message?: string;
    title?: string;
    errors?: Record<string, string>;
}

export function extractError(err: unknown): string {
    const error = err as AxiosError<ErrorBody>;
    const data = error?.response?.data;

    if (!data) {
        return 'Сетевая ошибка. Проверьте подключение и попробуйте снова.';
    }
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.message === 'string') return data.message;
    if (data.errors && typeof data.errors === 'object') {
        const first = Object.values(data.errors)[0];
        if (typeof first === 'string') return first;
    }
    if (typeof data.title === 'string') return data.title;
    return 'Произошла ошибка. Попробуйте ещё раз.';
}
