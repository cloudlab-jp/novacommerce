import { useQuery } from '@tanstack/react-query';
import { catalogApi } from './catalog.api';

export function useProducts(params?: { q?: string; categoryId?: string }) {
  return useQuery({
    queryKey: ['products', params ?? {}],
    queryFn: () => catalogApi.list(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => catalogApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: catalogApi.categories,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: catalogApi.brands,
  });
}
