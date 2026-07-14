import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProduct, useUpdateProduct } from './admin.hooks';
import { useCategories } from '@/features/catalog/catalog.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { ApiError } from '@/lib/http-client';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isPending } = useAdminProduct(id ?? '');
  const { data: categories } = useCategories();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState({ name: '', price: '', description: '', categoryId: '' });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: String(product.price),
        description: product.description,
        categoryId: product.categoryId,
      });
    }
  }, [product]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    updateProduct.mutate(
      {
        id,
        payload: {
          name: form.name,
          price: Number(form.price),
          description: form.description,
          categoryId: form.categoryId,
        },
      },
      { onSuccess: () => navigate('/admin/products') },
    );
  }

  if (isPending) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Precio</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Categoría</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {updateProduct.isError && (
          <p className="text-sm text-danger">
            {updateProduct.error instanceof ApiError ? updateProduct.error.message : 'No fue posible guardar los cambios'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateProduct.isPending}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {updateProduct.isPending ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
