import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/checkout' } });
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-24 text-center">
        <ShoppingBag size={40} className="text-slate-300" />
        <h1 className="text-xl font-semibold text-secondary">Tu carrito está vacío</h1>
        <p className="text-sm text-slate-500">Explora el catálogo y agrega algo que te guste.</p>
        <Link
          to="/catalog"
          className="mt-3 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 rounded-xl border border-slate-200 p-4"
              >
                <Link to={`/products/${item.slug}`} className="h-20 w-20 shrink-0">
                  <ProgressiveImage src={item.image} alt={item.name} aspect="aspect-square" />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${item.slug}`} className="text-sm font-medium text-slate-800 hover:text-primary">
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Quitar del carrito"
                      className="text-slate-400 hover:text-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="flex h-8 w-8 items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-slate-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-xl border border-slate-200 p-6">
          <p className="mb-4 text-sm font-medium text-slate-700">Resumen</p>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-slate-400">
            <span>Envío</span>
            <span>Se calcula en checkout</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-secondary">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Ir a checkout
          </button>
        </div>
      </div>
    </div>
  );
}
