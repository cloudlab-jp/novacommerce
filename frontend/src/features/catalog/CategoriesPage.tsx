import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from './catalog.hooks';

export default function CategoriesPage() {
  const { data: categories, isPending } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-secondary">Categories</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
          : categories?.map((c) => (
              <Link
                key={c.id}
                to={`/categories/${c.slug}`}
                className="rounded-xl border border-slate-200 p-5 hover:border-primary"
              >
                <p className="font-medium text-slate-800">{c.name}</p>
                <p className="mt-1 text-sm text-slate-500">{c.description}</p>
                <p className="mt-3 text-xs text-slate-400">{c.productCount} products</p>
              </Link>
            ))}
      </div>
    </div>
  );
}
