import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useUpdateProfile } from '@/features/auth/auth.hooks';
import { ApiError } from '@/lib/http-client';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg text-white">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-800">{user?.name}</p>
            <p className="text-xs capitalize text-slate-400">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nombre completo</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {updateProfile.isError && (
          <p className="text-sm text-danger">
            {updateProfile.error instanceof ApiError ? updateProfile.error.message : 'No fue posible guardar los cambios'}
          </p>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
            saved ? 'bg-success' : 'bg-primary hover:opacity-90'
          }`}
        >
          {updateProfile.isPending ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
