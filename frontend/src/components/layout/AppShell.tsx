import { cn } from '@/lib/utils';
import { Header } from './Header';

export function AppShell({
    children,
    mainClassName,
}: {
    children: React.ReactNode;
    mainClassName?: string;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className={cn('mx-auto w-full max-w-6xl px-6 py-6', mainClassName)}>
                {children}
            </main>
        </div>
    );
}
