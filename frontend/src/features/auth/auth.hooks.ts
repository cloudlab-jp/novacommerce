import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginPayload, type RegisterPayload } from './auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError } from '@/lib/http-client';

/**
 * Bootstrap de sesión: se ejecuta una vez al montar la app.
 * Intenta /auth/me (que viaja con la cookie HttpOnly). Si responde 401,
 * simplemente significa "no hay sesión" -> user null, sin tratarlo como
 * error de aplicación.
 */
export function useSessionBootstrap() {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then((user) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, setInitializing]);
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries();
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (user) => setUser(user),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Se limpia el estado local incluso si el request de logout falla,
      // para no dejar al usuario "atascado" con una UI autenticada.
      logout();
      queryClient.clear();
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (user) => setUser(user),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'No fue posible iniciar sesión';
}
