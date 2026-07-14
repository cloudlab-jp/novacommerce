import { useState, type FormEvent } from 'react';
import { useChangePassword } from '@/features/auth/auth.hooks';
import { ApiError } from '@/lib/http-client';

export default function SettingsPage() {
  const changePassword = useChangePassword();
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: false });
  const [saved, setSaved] = useState(false);

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    changePassword.mutate(
      { currentPassword: passwords.current, newPassword: passwords.next },
      {
        onSuccess: () => {
          setPasswords({ current: '', next: '' });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      },
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-secondary">Settings</h1>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-700">Cambiar contraseña</p>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Contraseña actual</label>
          <input
            required
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-600">Nueva contraseña</label>
          <input
            required
            minLength={8}
            type="password"
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {changePassword.isError && (
          <p className="text-sm text-danger">
            {changePassword.error instanceof ApiError ? changePassword.error.message : 'No fue posible cambiar la contraseña'}
          </p>
        )}

        <button
          type="submit"
          disabled={changePassword.isPending}
          className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
            saved ? 'bg-success' : 'bg-primary hover:opacity-90'
          }`}
        >
          {changePassword.isPending ? 'Actualizando...' : saved ? 'Actualizada ✓' : 'Actualizar contraseña'}
        </button>
      </form>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-700">Notificaciones</p>
        <p className="text-xs text-slate-400">
          Estas preferencias son solo de interfaz por ahora — se persisten cuando exista el backend real.
        </p>

        <label className="flex items-center justify-between text-sm text-slate-600">
          Actualizaciones de mis pedidos
          <input
            type="checkbox"
            checked={notifications.orderUpdates}
            onChange={(e) => setNotifications((n) => ({ ...n, orderUpdates: e.target.checked }))}
          />
        </label>
        <label className="flex items-center justify-between text-sm text-slate-600">
          Promociones y novedades
          <input
            type="checkbox"
            checked={notifications.promotions}
            onChange={(e) => setNotifications((n) => ({ ...n, promotions: e.target.checked }))}
          />
        </label>
      </div>
    </div>
  );
}
