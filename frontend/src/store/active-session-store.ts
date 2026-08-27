import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActiveSession {
    sessionId: string;
    programId: string;
    workoutDayId: string;
    startedAt: string;
}

interface ActiveSessionState {
    active: ActiveSession | null;
    _hasHydrated: boolean;
    setActive: (session: ActiveSession) => void;
    clear: () => void;
    setHasHydrated: (value: boolean) => void;
}

export const useActiveSessionStore = create<ActiveSessionState>()(
    persist(
        (set) => ({
            active: null,
            _hasHydrated: false,
            setActive: (session) => set({ active: session }),
            clear: () => set({ active: null }),
            setHasHydrated: (value) => set({ _hasHydrated: value }),
        }),
        {
            name: 'active-session',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
