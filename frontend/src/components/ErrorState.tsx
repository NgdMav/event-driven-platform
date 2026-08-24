import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
            <h3 className="text-lg font-semibold text-red-700">Что-то пошло не так</h3>
            <p className="mt-1 max-w-sm text-sm text-red-600">
                {message ?? 'Не удалось загрузить данные. Проверьте подключение к сети и попробуйте снова.'}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                    Попробовать снова
                </button>
            )}
        </div>
    );
}
