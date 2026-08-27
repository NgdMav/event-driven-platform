import { cn } from '@/lib/utils';

type BadgeVariant = 'blue' | 'gray' | 'purple' | 'emerald' | 'red';

const variantClasses: Record<BadgeVariant, string> = {
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    red: 'bg-red-100 text-red-800',
};

export function Badge({
    variant = 'gray',
    className,
    children,
}: {
    variant?: BadgeVariant;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                'rounded px-2 py-0.5 text-xs font-medium',
                variantClasses[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
