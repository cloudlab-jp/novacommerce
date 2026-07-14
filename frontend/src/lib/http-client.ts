import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

// withCredentials: true es lo que permite que el navegador envíe/reciba las
// cookies HttpOnly de access/refresh token en cada request, sin que el
// frontend las toque nunca en JS (localStorage queda descartado por diseño).
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  timeout: 15_000,
});

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ---- Refresh token: single-flight ----
// Si llegan varias requests en paralelo con 401, solo se dispara UNA llamada
// a /auth/refresh; el resto espera esa misma promesa en vez de disparar N
// refresh simultáneos (causa clásica de bucles/carreras).
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = httpClient
      .post('/auth/refresh')
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

httpClient.interceptors.request.use((config) => {
  // Punto de extensión: correlación de requests, headers de tracing, etc.
  config.headers.set('X-Client', 'novacommerce-web');
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    // 401 -> intenta refrescar UNA vez y reintenta la request original.
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return httpClient(originalRequest);
      } catch {
        // El refresh también falló: sesión realmente expirada -> logout forzado.
        useAuthStore.getState().logout();
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(
          new ApiError('Sesión expirada, inicia sesión nuevamente', 401, 'SESSION_EXPIRED'),
        );
      }
    }

    // Manejo centralizado de errores: todo error sale de aquí normalizado
    // como ApiError, para que features/ nunca tengan que parsear AxiosError.
    const status = error.response?.status ?? 0;
    const data = error.response?.data as
      | { message?: string; code?: string; details?: unknown }
      | undefined;

    if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    }

    return Promise.reject(
      new ApiError(
        data?.message ?? defaultMessageFor(status),
        status,
        data?.code,
        data?.details,
      ),
    );
  },
);

function defaultMessageFor(status: number): string {
  switch (status) {
    case 0:
      return 'No fue posible conectar con el servidor';
    case 400:
      return 'Solicitud inválida';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 409:
      return 'Conflicto con el estado actual del recurso';
    case 422:
      return 'Datos de entrada inválidos';
    case 500:
    default:
      return 'Ocurrió un error inesperado en el servidor';
  }
}
