import { Suspense, lazy, type ComponentType } from 'react';
import { FullPageSkeleton } from '@/components/ui/full-page-skeleton';

/**
 * Envuelve React.lazy + Suspense en una sola llamada, para que cada ruta
 * lazy-loaded tenga el mismo fallback (skeleton) sin repetir boilerplate.
 */
export function lazyRoute(importFn: () => Promise<{ default: ComponentType }>) {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <LazyComponent />
    </Suspense>
  );
}
