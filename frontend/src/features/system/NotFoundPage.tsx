import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <CompassIcon size={48} className="mx-auto mb-4 text-slate-400" />
      <h1 className="text-3xl font-semibold text-secondary">404</h1>
      <p className="mt-2 text-slate-500">Esta página no existe.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
