import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Permission } from '@/types/auth';
import { useAuthStore } from '@/stores/auth.store';
import { FullPageSkeleton } from '@/components/ui/full-page-skeleton';

interface ProtectedRouteProps {
  /** Si se define, además de estar autenticado, el usuario debe tener este permiso. */
  permission?: Permission;
}

/**
 * Gate único para rutas privadas.
 * - Sin sesión           -> redirige a /login con `redirectTo` para volver tras loguear.
 * - Con sesión pero sin
 *   el permiso requerido -> redirige a /403 (NO a login: sí está autenticado).
 * - Mientras se resuelve
 *   el bootstrap de sesión (cookie -> /auth/me) -> skeleton, nunca un flash de redirect.
 */
export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, can } = useAuthStore();
  const location = useLocation();

  if (isInitializing) {
    return <FullPageSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  if (permission && !can(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

/**
 * Gate inverso: rutas que solo tienen sentido para invitados (Login, Register).
 * Un usuario ya autenticado es redirigido a su home por rol.
 */
export function GuestOnlyRoute() {
  const { isAuthenticated, isInitializing, user } = useAuthStore();

  if (isInitializing) return <FullPageSkeleton />;

  if (isAuthenticated) {
    const home = user?.role === 'customer' || user?.role === 'guest' ? '/dashboard' : '/admin';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
