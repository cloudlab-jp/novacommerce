import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/features/orders/orders.api';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-slate-100 text-slate-600',
  processing: 'bg-blue-50 text-primary',
  shipped: 'bg-violet-50 text-accent',
  delivered: 'bg-green-50 text-success',
  cancelled: 'bg-red-50 text-danger',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
