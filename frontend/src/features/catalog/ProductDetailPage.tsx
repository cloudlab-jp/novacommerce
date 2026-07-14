import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useProduct } from './catalog.hooks';
import { useCartStore } from '@/stores/cart.store';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isPending, isError } = useProduct(slug ?? '');
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-slate-500">No encontramos este producto.</p>
        <Link to="/catalog" className="mt-4 inline-block text-sm font-medium text-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock < 20;

  function handleAddToCart() {
    if (!product) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        maxStock: product.stock,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2">
      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ProgressiveImage
              src={product.images[activeImage]}
              alt={product.name}
              priority
              className="aspect-square"
            />
          </motion.div>
        </AnimatePresence>

        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors',
                  i === activeImage ? 'border-primary' : 'border-transparent',
                )}
              >
                <ProgressiveImage src={img} alt={`${product.name} ${i + 1}`} aspect="aspect-square" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-secondary">{product.name}</h1>
        <p className="mt-2 text-xl font-medium text-slate-800">${product.price.toFixed(2)}</p>

        <p
          className={cn(
            'mt-2 text-sm font-medium',
            outOfStock ? 'text-danger' : lowStock ? 'text-warning' : 'text-success',
          )}
        >
          {outOfStock ? 'Agotado' : lowStock ? `Solo quedan ${product.stock}` : 'En stock'}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-slate-600">{product.description}</p>

        {!outOfStock && (
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Cantidad</span>
            <div className="flex items-center rounded-lg border border-slate-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-800"
                aria-label="Disminuir cantidad"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-9 w-9 items-center justify-center text-slate-500 hover:text-slate-800"
                aria-label="Aumentar cantidad"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={cn(
              'flex-1 rounded-xl py-3 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40',
              added ? 'bg-success' : 'bg-primary hover:opacity-90',
            )}
          >
            {outOfStock ? 'No disponible' : added ? 'Agregado ✓' : 'Agregar al carrito'}
          </button>
          {!outOfStock && (
            <button
              onClick={() => {
                handleAddToCart();
                navigate('/cart');
              }}
              className="rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Comprar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
