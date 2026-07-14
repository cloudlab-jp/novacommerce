import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';
import { queryClient } from '@/lib/query-client';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppRouter } from '@/routes/AppRouter';
import { useSessionBootstrap } from '@/features/auth/auth.hooks';

function SessionGate() {
  useSessionBootstrap();

  // Eventos globales emitidos por el interceptor de Axios (http-client.ts):
  // desacopla "qué pasó con la red" de "cómo se lo mostramos al usuario".
  useEffect(() => {
    const onExpired = () => toast.error('Tu sesión expiró, inicia sesión nuevamente');
    const onForbidden = () => toast.error('No tienes permisos para esa acción');

    window.addEventListener('auth:session-expired', onExpired);
    window.addEventListener('auth:forbidden', onForbidden);
    return () => {
      window.removeEventListener('auth:session-expired', onExpired);
      window.removeEventListener('auth:forbidden', onForbidden);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SessionGate />
        <AppRouter />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
