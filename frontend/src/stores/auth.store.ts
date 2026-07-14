import { create } from 'zustand';
import type { Permission, User } from '@/types/auth';
import { roleHasPermission } from '@/types/auth';

interface AuthState {
  user: User | null;
  /** true mientras se resuelve el "who am I" inicial (cookie -> user) */
  isInitializing: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setInitializing: (value: boolean) => void;
  logout: () => void;
  can: (permission: Permission) => boolean;
}

// IMPORTANTE: este store NUNCA guarda access/refresh tokens.
// Los tokens viven exclusivamente en cookies HttpOnly + Secure + SameSite,
// escritas y leídas por el backend. El frontend solo guarda el `user`
// (derivado de /auth/me) para pintar la UI y decidir gates de rutas.
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitializing: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setInitializing: (value) => set({ isInitializing: value }),
  logout: () => set({ user: null, isAuthenticated: false }),
  can: (permission) => {
    const { user } = get();
    if (!user) return roleHasPermission('guest', permission);
    return roleHasPermission(user.role, permission);
  },
}));
