import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '@/lib/types';

interface OnboardingState {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  authUserId: string;
  role: Role | null;

  setNameInfo: (data: { firstName: string; middleName: string; lastName: string }) => void;
  setAccountInfo: (data: { email: string; authUserId: string }) => void;
  setRole: (role: Role) => void;
  reset: () => void;
}

const defaults = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  authUserId: '',
  role: null as Role | null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...defaults,
      setNameInfo: (data) => set({ ...data }),
      setAccountInfo: (data) => set({ ...data }),
      setRole: (role) => set({ role }),
      reset: () => set(defaults),
    }),
    {
      name: 'gemsis-onboarding',
      partialize: (state) => ({
        firstName: state.firstName,
        middleName: state.middleName,
        lastName: state.lastName,
        email: state.email,
        authUserId: state.authUserId,
        role: state.role,
      }),
    },
  ),
);
