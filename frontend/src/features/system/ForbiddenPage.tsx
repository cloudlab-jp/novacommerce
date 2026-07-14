import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="text-center">
      <ShieldAlert size={48} className="mx-auto mb-4 text-warning" />
      <h1 className="text-3xl font-semibold text-secondary">403</h1>
      <p className="mt-2 text-slate-500">No tienes permisos para acceder a esta sección.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
