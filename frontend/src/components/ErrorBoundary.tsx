import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ServerCrash } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Boundary a nivel de aplicación. Captura cualquier excepción de render no
 * manejada en el árbol de rutas y muestra un fallback tipo "500" en vez de
 * dejar caer toda la app (pantalla blanca).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Punto de integración con Sentry/CloudWatch/etc.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <ServerCrash size={48} className="text-danger" />
          <h1 className="text-2xl font-semibold text-secondary">
            Algo salió mal
          </h1>
          <p className="max-w-sm text-sm text-slate-500">
            Ocurrió un error inesperado. Puedes intentar recargar esta sección.
          </p>
          <button
            onClick={this.reset}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
