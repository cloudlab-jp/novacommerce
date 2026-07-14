import { useAdminUsers, useUpdateUserRole } from './admin.hooks';
import type { Role } from '@/types/auth';
import { useAuthStore } from '@/stores/auth.store';

const ROLE_OPTIONS: Role[] = ['customer', 'catalog_manager', 'inventory_manager', 'order_manager', 'admin'];

export default function UsersPage() {
  const { data: users, isPending } = useAdminUsers();
  const updateRole = useUpdateUserRole();
  const currentUser = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Users & Roles</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-4 py-3" colSpan={3}>
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              : users?.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => updateRole.mutate({ userId: u.id, role: e.target.value as Role })}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-primary disabled:opacity-50"
                          title={isSelf ? 'No puedes cambiar tu propio rol' : undefined}
                        >
                          {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {r.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
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
