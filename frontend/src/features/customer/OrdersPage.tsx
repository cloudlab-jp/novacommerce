import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { useMyOrders } from '@/features/orders/orders.hooks';

export default function OrdersPage() {
  const { data: orders, isPending } = useMyOrders();

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <PackageSearch size={36} className="text-slate-300" />
        <h1 className="text-lg font-semibold text-secondary">Aún no tienes pedidos</h1>
        <Link to="/catalog" className="text-sm font-medium text-primary">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/dashboard/orders/${order.id}`}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-primary"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">{order.id}</p>
              <p className="text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} artículo(s)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-slate-700">${order.total.toFixed(2)}</p>
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
