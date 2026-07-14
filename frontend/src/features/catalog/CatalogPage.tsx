import { ProductCard, ProductCardSkeleton } from './components/ProductCard';
import { useProducts } from './catalog.hooks';

export default function CatalogPage() {
  const { data: products, isPending } = useProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Catalog</h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
