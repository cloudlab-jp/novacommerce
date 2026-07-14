import { useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { useProducts } from '@/features/catalog/catalog.hooks';
import { useUpdateStock } from './admin.hooks';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
  const { data: products, isPending } = useProducts();
  const updateStock = useUpdateStock();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState('');

  function startEdit(productId: string, currentStock: number) {
    setEditingId(productId);
    setDraftValue(String(currentStock));
  }

  function commitEdit(productId: string) {
    const stock = Number(draftValue);
    if (!Number.isFinite(stock) || stock < 0) {
      setEditingId(null);
      return;
    }
    updateStock.mutate({ productId, stock }, { onSuccess: () => setEditingId(null) });
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Inventory</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-4 py-3" colSpan={4}>
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              : products?.map((p) => {
                  const isEditing = editingId === p.id;
                  const stockColor =
                    p.stock === 0 ? 'text-danger' : p.stock < 20 ? 'text-warning' : 'text-success';

                  return (
                    <tr key={p.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                      <td className="px-4 py-3 text-slate-500">{p.categoryId.replace('cat_', '')}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            value={draftValue}
                            onChange={(e) => setDraftValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && commitEdit(p.id)}
                            className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-primary"
                          />
                        ) : (
                          <span className={cn('font-medium', stockColor)}>{p.stock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => commitEdit(p.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-success hover:bg-green-50"
                              aria-label="Guardar"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
                              aria-label="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(p.id, p.stock)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                            aria-label="Editar stock"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
