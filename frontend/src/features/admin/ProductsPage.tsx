import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Plus, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '@/features/catalog/catalog.hooks';
import type { Product } from '@/features/catalog/catalog.api';

const columnHelper = createColumnHelper<Product>();

export default function ProductsPage() {
  const { data: products, isPending } = useProducts();
  const { data: categories } = useCategories();

  const categoryNameById = useMemo(
    () => new Map(categories?.map((c) => [c.id, c.name]) ?? []),
    [categories],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Product' }),
      columnHelper.accessor('categoryId', {
        header: 'Category',
        cell: (info) => categoryNameById.get(info.getValue()) ?? info.getValue(),
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => {
          const stock = info.getValue();
          const color = stock === 0 ? 'text-danger' : stock < 20 ? 'text-warning' : 'text-success';
          return <span className={color}>{stock}</span>;
        },
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => (
          <Link
            to={`/admin/products/${info.row.original.id}/edit`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            aria-label="Editar producto"
          >
            <Pencil size={14} />
          </Link>
        ),
      }),
    ],
    [categoryNameById],
  );

  const table = useReactTable({
    data: products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-secondary">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td className="px-4 py-3" colSpan={4}>
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
