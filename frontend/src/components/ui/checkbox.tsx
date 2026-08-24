import * as React from 'react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            ref={ref}
            type="checkbox"
            className={cn(
                'h-5 w-5 rounded border-gray-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500',
                className
            )}
            {...props}
        />
    )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
