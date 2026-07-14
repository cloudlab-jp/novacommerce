import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind aspect-ratio class, ej. "aspect-square" | "aspect-[4/3]" */
  aspect?: string;
  /** true para la imagen principal above-the-fold (ej. la del detalle de producto). */
  priority?: boolean;
}

/**
 * Envoltorio único de <img> para todo el catálogo.
 *
 * Resuelve tres cosas que NO hace un <img> plano:
 * 1. Reserva el espacio con `aspect-*` -> cero layout shift mientras carga.
 * 2. Muestra un Skeleton (mismo componente que loading states del resto de
 *    la app) hasta que la imagen termina de cargar, y hace fade-in al entrar.
 * 3. Si la imagen falla (404, CDN caído, etc.) cae a un estado de fallback
 *    en vez de dejar el ícono roto del navegador.
 */
export function ProgressiveImage({
  src,
  alt,
  className,
  aspect = 'aspect-square',
  priority = false,
}: ProgressiveImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-slate-100', aspect, className)}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      )}

      {status === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400">
          <ImageOff size={24} />
          <span className="text-xs">Imagen no disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
