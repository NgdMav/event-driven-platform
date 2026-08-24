'use client';

import { cn } from '@/lib/utils';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
    children?: React.ReactNode;
}

export function Dialog({ open, onClose, title, description, footer, children }: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    'relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-xl'
                )}
            >
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
                {children}
                {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}
