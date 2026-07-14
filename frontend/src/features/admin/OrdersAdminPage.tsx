import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { useAdminOrders, useUpdateOrderStatus } from './admin.hooks';
import type { OrderStatus } from '@/features/orders/orders.api';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersAdminPage() {
  const { data: orders, isPending } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Orders</h1>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isPending
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-4 py-3" colSpan={4}>
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              : orders?.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{order.id}</span>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{order.customerName}</td>
                    <td className="px-4 py-3 text-slate-700">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus.mutate({ orderId: order.id, status: e.target.value as OrderStatus })
                          }
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-primary"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
