import { httpClient } from '@/lib/http-client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryId: string;
  description: string;
  /** Primera imagen = principal (usada en cards/listados). El resto alimenta la galería del detalle. */
  images: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export const catalogApi = {
  list: (params?: { q?: string; categoryId?: string }) =>
    httpClient.get<Product[]>('/products', { params }).then((res) => res.data),

  getBySlug: (slug: string) =>
    httpClient.get<Product>(`/products/${slug}`).then((res) => res.data),

  categories: () => httpClient.get<Category[]>('/categories').then((res) => res.data),

  brands: () => httpClient.get<Brand[]>('/brands').then((res) => res.data),
};
