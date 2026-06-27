import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  sub: string;
  name?: string;
  roles: string[];
  scopes: string[];
  facility_id?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  hasScope: (scope: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      hasScope: (s) => get().user?.scopes.includes(s) ?? false,
      hasRole: (r) => get().user?.roles.includes(r) ?? false,
    }),
    { name: 'nama-auth' },
  ),
);
