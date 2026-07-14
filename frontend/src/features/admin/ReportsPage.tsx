import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useAdminOrders } from './admin.hooks';
import { useProducts, useCategories } from '@/features/catalog/catalog.hooks';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_COLORS: Record<string, string> = {
  pending: '#94a3b8',
  processing: '#2563eb',
  shipped: '#7c3aed',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

export default function ReportsPage() {
  const { data: orders, isPending: ordersPending } = useAdminOrders();
  const { data: products, isPending: productsPending } = useProducts();
  const { data: categories } = useCategories();

  const revenueByCategory = useMemo(() => {
    if (!orders || !products) return [];
    const categoryById = new Map(categories?.map((c) => [c.id, c.name]) ?? []);
    const productById = new Map(products.map((p) => [p.id, p]));
    const totals = new Map<string, number>();

    for (const order of orders) {
      for (const item of order.items) {
        const product = productById.get(item.productId);
        const categoryName = product ? categoryById.get(product.categoryId) ?? 'Otros' : 'Otros';
        totals.set(categoryName, (totals.get(categoryName) ?? 0) + item.price * item.quantity);
      }
    }
    return Array.from(totals.entries()).map(([category, revenue]) => ({ category, revenue }));
  }, [orders, products, categories]);

  const ordersByStatus = useMemo(() => {
    if (!orders) return [];
    const counts = new Map<string, number>();
    for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
    return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
  }, [orders]);

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total, 0) ?? 0;
  const isPending = ordersPending || productsPending;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Reports</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Revenue total" value={`$${totalRevenue.toFixed(2)}`} isPending={isPending} />
        <StatCard label="Órdenes" value={String(orders?.length ?? 0)} isPending={isPending} />
        <StatCard label="Productos activos" value={String(products?.length ?? 0)} isPending={isPending} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-medium text-slate-700">Revenue por categoría</p>
          {isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-sm font-medium text-slate-700">Órdenes por estado</p>
          {isPending ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={ordersByStatus} dataKey="count" nameKey="status" innerRadius={50} outerRadius={90}>
                  {ordersByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isPending }: { label: string; value: string; isPending: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      {isPending ? (
        <Skeleton className="mt-2 h-7 w-20" />
      ) : (
        <p className="mt-1 text-2xl font-semibold text-secondary">{value}</p>
      )}
    </div>
  );
}
