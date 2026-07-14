import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useMyOrders } from '@/features/orders/orders.hooks';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: orders, isPending } = useMyOrders();
  const recentOrders = orders?.slice(0, 3) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-secondary">
        Hola, {user?.name} 👋
      </h1>
      <p className="mt-1 text-slate-500">Este es tu panel de cliente.</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">Pedidos recientes</p>
          <Link to="/dashboard/orders" className="text-xs font-medium text-primary">
            Ver todos
          </Link>
        </div>

        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400">Aún no tienes pedidos.</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 hover:border-primary"
              >
                <span className="text-sm text-slate-700">{order.id}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">${order.total.toFixed(2)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/dashboard/addresses" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary">
          <p className="text-sm font-medium text-slate-700">Direcciones</p>
          <p className="mt-2 text-xs text-slate-400">Gestiona tus direcciones de envío</p>
        </Link>
        <Link to="/dashboard/wishlist" className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary">
          <p className="text-sm font-medium text-slate-700">Wishlist</p>
          <p className="mt-2 text-xs text-slate-400">Tus productos guardados</p>
        </Link>
      </div>
    </div>
  );
}
