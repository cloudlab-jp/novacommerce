import { useParams, Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';
import { useOrder } from '@/features/orders/orders.hooks';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isPending, isError } = useOrder(orderId ?? '');

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-center">
        <p className="text-slate-500">No encontramos esta orden, o no tienes acceso a ella.</p>
        <Link to="/dashboard/orders" className="mt-3 inline-block text-sm font-medium text-primary">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">{order.id}</h1>
          <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {order.items.map((item, i) => (
          <div
            key={item.productId}
            className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-slate-100' : ''}`}
          >
            <div>
              <p className="text-sm font-medium text-slate-800">{item.name}</p>
              <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm text-slate-700">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-200 p-4 text-base font-semibold text-secondary">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Dirección de envío</p>
          <p className="text-sm text-slate-500">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}, {order.shippingAddress.city}
            <br />
            {order.shippingAddress.zip}, {order.shippingAddress.country}
          </p>
        </div>
      )}
    </div>
  );
}
