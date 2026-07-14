import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlist.store';
import { useCartStore } from '@/stores/cart.store';
import { ProgressiveImage } from '@/components/ui/progressive-image';

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.remove);
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Heart size={36} className="text-slate-300" />
        <h1 className="text-lg font-semibold text-secondary">Tu wishlist está vacía</h1>
        <Link to="/catalog" className="text-sm font-medium text-primary">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.productId} className="rounded-xl border border-slate-200 bg-white p-3">
            <Link to={`/products/${item.slug}`}>
              <ProgressiveImage src={item.image} alt={item.name} className="mb-2" />
            </Link>
            <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
            <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  addToCart({
                    productId: item.productId,
                    slug: item.slug,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    maxStock: 999,
                  })
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-xs font-medium text-white hover:opacity-90"
              >
                <ShoppingCart size={12} /> Agregar
              </button>
              <button
                onClick={() => removeFromWishlist(item.productId)}
                aria-label="Quitar de wishlist"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-danger"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
