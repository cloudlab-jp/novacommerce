import { useAdminCustomers } from './admin.hooks';

export default function CustomersPage() {
  const { data: customers, isPending } = useAdminCustomers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Customers</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td className="px-4 py-3" colSpan={4}>
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                </td>
              </tr>
            ) : customers?.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-400" colSpan={4}>
                  Aún no hay clientes registrados.
                </td>
              </tr>
            ) : (
              customers?.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{c.ordersCount}</td>
                  <td className="px-4 py-3 text-slate-700">${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
