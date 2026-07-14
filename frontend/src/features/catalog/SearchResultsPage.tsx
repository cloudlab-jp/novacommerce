import { useSearchParams } from 'react-router-dom';
import { ProductCard, ProductCardSkeleton } from './components/ProductCard';
import { useProducts } from './catalog.hooks';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { data: products, isPending } = useProducts({ q });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-secondary">Search Results</h1>
      <p className="mb-6 text-sm text-slate-500">
        {q ? `Resultados para "${q}"` : 'Escribe algo para buscar'}
      </p>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.length === 0
            ? <p className="col-span-full text-sm text-slate-400">Sin resultados.</p>
            : products?.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
