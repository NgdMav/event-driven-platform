import { AppShell } from '@/components/layout/AppShell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell mainClassName="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
            {children}
        </AppShell>
    );
}
