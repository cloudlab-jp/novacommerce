import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Star, Pencil } from 'lucide-react';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/features/addresses/addresses.hooks';
import type { CreateAddressPayload } from '@/features/addresses/addresses.api';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const EMPTY_FORM: CreateAddressPayload = {
  label: '',
  fullName: '',
  line1: '',
  city: '',
  zip: '',
  country: 'Colombia',
  isDefault: false,
};

export default function AddressesPage() {
  const { data: addresses, isPending } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAddressPayload>(EMPTY_FORM);

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(addr: CreateAddressPayload & { id: string }) {
    setForm(addr);
    setEditingId(addr.id);
    setShowForm(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateAddress.mutate(
        { id: editingId, payload: form },
        { onSuccess: () => setShowForm(false) },
      );
    } else {
      createAddress.mutate(form, { onSuccess: () => setShowForm(false) });
    }
  }

  const isSaving = createAddress.isPending || updateAddress.isPending;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-secondary">Addresses</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> Nueva dirección
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Etiqueta (Casa, Oficina...)" value={form.label} onChange={(v) => setForm((f) => ({ ...f, label: v }))} />
            <Field label="Nombre completo" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
          </div>
          <Field label="Dirección" value={form.line1} onChange={(v) => setForm((f) => ({ ...f, line1: v }))} />
          <div className="grid grid-cols-3 gap-4">
            <Field label="Ciudad" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
            <Field label="Código postal" value={form.zip} onChange={(v) => setForm((f) => ({ ...f, zip: v }))} />
            <Field label="País" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            />
            Usar como dirección predeterminada
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Agregar dirección'}
            </button>
          </div>
        </form>
      )}

      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : addresses?.length === 0 ? (
        <p className="text-sm text-slate-400">Aún no tienes direcciones guardadas.</p>
      ) : (
        <div className="space-y-3">
          {addresses?.map((addr) => (
            <div key={addr.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-800">{addr.label}</p>
                  {addr.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-primary">
                      <Star size={10} fill="currentColor" /> Predeterminada
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {addr.fullName} · {addr.line1}, {addr.city}, {addr.zip}, {addr.country}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditForm(addr)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                  aria-label="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteAddress.mutate(addr.id)}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger',
                  )}
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
