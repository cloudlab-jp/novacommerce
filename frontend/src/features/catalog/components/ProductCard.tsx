import { Link } from 'react-router-dom';
import { Plus, Check, Heart } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { ProgressiveImage } from '@/components/ui/progressive-image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart.store';
import { useWishlistStore } from '@/stores/wishlist.store';
import type { Product } from '../catalog.api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0;
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  function handleQuickAdd(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      maxStock: product.stock,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  function handleToggleWishlist(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block rounded-xl border border-slate-200 p-3 transition-colors hover:border-primary"
    >
      <div className="relative mb-2">
        <ProgressiveImage
          src={product.images[0]}
          alt={product.name}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-danger shadow-sm">
            Agotado
          </span>
        )}
        <button
          onClick={handleToggleWishlist}
          aria-label="Agregar a wishlist"
          className={cn(
            'absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors',
            outOfStock && 'top-9',
            isWishlisted ? 'text-danger' : 'text-slate-400 hover:text-danger',
          )}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        {!outOfStock && (
          <button
            onClick={handleQuickAdd}
            aria-label="Agregar al carrito"
            className={cn(
              'absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition-colors',
              justAdded ? 'bg-success text-white' : 'bg-white text-slate-700 hover:bg-primary hover:text-white',
            )}
          >
            {justAdded ? <Check size={16} /> : <Plus size={16} />}
          </button>
        )}
      </div>
      <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>
      <p className={cn('text-sm', outOfStock ? 'text-slate-400' : 'text-slate-500')}>
        ${product.price.toFixed(2)}
      </p>
    </Link>
  );
}

/** Skeleton con la misma forma que ProductCard, para listas en estado isPending. */
export function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
