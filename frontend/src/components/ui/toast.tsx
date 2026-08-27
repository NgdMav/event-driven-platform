'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
        const id = Date.now() + Math.random();
        setItems((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setItems((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            'pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg',
                            t.variant === 'success' && 'bg-blue-600',
                            t.variant === 'error' && 'bg-red-600',
                            t.variant === 'info' && 'bg-gray-800'
                        )}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return ctx;
}
