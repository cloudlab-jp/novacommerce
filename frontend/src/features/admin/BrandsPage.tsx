import { useState, type FormEvent } from 'react';
import { Plus, Tags } from 'lucide-react';
import { useBrands } from '@/features/catalog/catalog.hooks';
import { useCreateBrand } from './admin.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/lib/http-client';

export default function BrandsPage() {
  const { data: brands, isPending } = useBrands();
  const createBrand = useCreateBrand();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createBrand.mutate(
      { name },
      {
        onSuccess: () => {
          setName('');
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-secondary">Brands</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> New Brand
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 flex items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium text-slate-700">Nombre de la marca</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={createBrand.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {createBrand.isPending ? 'Creando...' : 'Crear'}
          </button>
        </form>
      )}

      {createBrand.isError && (
        <p className="mb-4 text-sm text-danger">
          {createBrand.error instanceof ApiError ? createBrand.error.message : 'No fue posible crear la marca'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          : brands?.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <Tags size={16} className="text-slate-400" />
                <p className="text-sm font-medium text-slate-800">{b.name}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
