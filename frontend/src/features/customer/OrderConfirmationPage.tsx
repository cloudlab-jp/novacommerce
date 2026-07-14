import { useParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center"
    >
      <CheckCircle2 size={48} className="text-success" />
      <h1 className="mt-4 text-2xl font-semibold text-secondary">¡Gracias por tu compra!</h1>
      <p className="mt-2 text-sm text-slate-500">
        Tu orden <span className="font-mono text-slate-700">{orderId}</span> fue confirmada.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to={`/dashboard/orders/${orderId}`}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Ver mi orden
        </Link>
        <Link
          to="/catalog"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Seguir comprando
        </Link>
      </div>
    </motion.div>
  );
}
