import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { useCategories } from '@/features/catalog/catalog.hooks';
import { useCreateCategory } from './admin.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/lib/http-client';

export default function CategoriesPage() {
  const { data: categories, isPending } = useCategories();
  const createCategory = useCreateCategory();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createCategory.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', description: '' });
        setShowForm(false);
      },
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-secondary">Categories</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              required
              placeholder="Descripción"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          {createCategory.isError && (
            <p className="text-sm text-danger">
              {createCategory.error instanceof ApiError ? createCategory.error.message : 'No fue posible crear la categoría'}
            </p>
          )}
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {createCategory.isPending ? 'Creando...' : 'Crear categoría'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : categories?.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-800">{c.name}</p>
                <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                <p className="mt-2 text-xs text-slate-400">{c.productCount} products</p>
              </div>
            ))}
      </div>
    </div>
  );
}
