import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useCreateOrder } from '@/features/orders/orders.hooks';
import { ApiError } from '@/lib/http-client';
import type { ShippingAddress } from '@/features/orders/orders.api';

type Step = 'address' | 'payment' | 'review';
const STEPS: { key: Step; label: string }[] = [
  { key: 'address', label: 'Dirección' },
  { key: 'payment', label: 'Pago' },
  { key: 'review', label: 'Revisión' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('address');
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    line1: '',
    city: '',
    zip: '',
    country: 'Colombia',
  });
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  if (items.length === 0 && !createOrder.isSuccess) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="text-slate-500">Tu carrito está vacío.</p>
        <Link to="/catalog" className="mt-3 inline-block text-sm font-medium text-primary">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  function handleAddressSubmit(e: FormEvent) {
    e.preventDefault();
    setStep('payment');
  }

  function handlePaymentSubmit(e: FormEvent) {
    e.preventDefault();
    setStep('review');
  }

  function handlePlaceOrder() {
    createOrder.mutate(
      {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        shippingAddress: address,
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/checkout/confirmation/${order.id}`, { replace: true });
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Checkout</h1>

      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  i < stepIndex
                    ? 'bg-success text-white'
                    : i === stepIndex
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {i < stepIndex ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm ${i === stepIndex ? 'font-medium text-slate-800' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="mx-3 h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'address' && (
          <motion.form
            key="address"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
            onSubmit={handleAddressSubmit}
            className="space-y-4"
          >
            <Field label="Nombre completo" value={address.fullName} onChange={(v) => setAddress((a) => ({ ...a, fullName: v }))} />
            <Field label="Dirección" value={address.line1} onChange={(v) => setAddress((a) => ({ ...a, line1: v }))} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ciudad" value={address.city} onChange={(v) => setAddress((a) => ({ ...a, city: v }))} />
              <Field label="Código postal" value={address.zip} onChange={(v) => setAddress((a) => ({ ...a, zip: v }))} />
            </div>
            <Field label="País" value={address.country} onChange={(v) => setAddress((a) => ({ ...a, country: v }))} />
            <StepButton>Continuar a pago</StepButton>
          </motion.form>
        )}

        {step === 'payment' && (
          <motion.form
            key="payment"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
            onSubmit={handlePaymentSubmit}
            className="space-y-4"
          >
            <p className="text-xs text-slate-400">
              Entorno de desarrollo — cualquier dato de tarjeta es aceptado, no se procesa un pago real.
            </p>
            <Field label="Número de tarjeta" value={card.number} onChange={(v) => setCard((c) => ({ ...c, number: v }))} placeholder="4242 4242 4242 4242" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiración" value={card.expiry} onChange={(v) => setCard((c) => ({ ...c, expiry: v }))} placeholder="MM/AA" />
              <Field label="CVC" value={card.cvc} onChange={(v) => setCard((c) => ({ ...c, cvc: v }))} placeholder="123" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('address')}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Atrás
              </button>
              <StepButton>Revisar orden</StepButton>
            </div>
          </motion.form>
        )}

        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Enviar a</p>
              <p className="text-sm text-slate-500">
                {address.fullName} · {address.line1}, {address.city}, {address.zip}, {address.country}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200">
              {items.map((item, i) => (
                <div
                  key={item.productId}
                  className={`flex justify-between p-4 text-sm ${i > 0 ? 'border-t border-slate-100' : ''}`}
                >
                  <span className="text-slate-600">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 p-4 text-base font-semibold text-secondary">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            {createOrder.isError && (
              <p className="text-sm text-danger">
                {createOrder.error instanceof ApiError ? createOrder.error.message : 'No fue posible crear la orden'}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Atrás
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {createOrder.isPending ? 'Procesando...' : 'Confirmar compra'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function StepButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:opacity-90"
    >
      {children}
    </button>
  );
}
