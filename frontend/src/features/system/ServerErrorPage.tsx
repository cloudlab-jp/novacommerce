import { ServerCrash } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="text-center">
      <ServerCrash size={48} className="mx-auto mb-4 text-danger" />
      <h1 className="text-3xl font-semibold text-secondary">500</h1>
      <p className="mt-2 text-slate-500">Ocurrió un error inesperado en el servidor.</p>
    </div>
  );
}
