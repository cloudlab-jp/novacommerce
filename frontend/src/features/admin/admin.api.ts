import { httpClient } from '@/lib/http-client';
import type { Order, OrderStatus } from '@/features/orders/orders.api';
import type { Product, Category, Brand } from '@/features/catalog/catalog.api';
import type { Role, User } from '@/types/auth';

export interface CustomerWithStats extends User {
  ordersCount: number;
  totalSpent: number;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  description?: string;
  categoryId?: string;
}

export const adminApi = {
  // Inventory
  updateStock: (productId: string, stock: number) =>
    httpClient.patch<Product>(`/admin/inventory/${productId}`, { stock }).then((res) => res.data),

  // Orders
  listOrders: () => httpClient.get<Order[]>('/admin/orders').then((res) => res.data),
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    httpClient.patch<Order>(`/admin/orders/${orderId}`, { status }).then((res) => res.data),

  // Users & Roles
  listUsers: () => httpClient.get<User[]>('/admin/users').then((res) => res.data),
  updateUserRole: (userId: string, role: Role) =>
    httpClient.patch<User>(`/admin/users/${userId}/role`, { role }).then((res) => res.data),

  // Catalog: categories & brands
  createCategory: (payload: { name: string; description: string }) =>
    httpClient.post<Category>('/admin/categories', payload).then((res) => res.data),
  createBrand: (payload: { name: string }) =>
    httpClient.post<Brand>('/admin/brands', payload).then((res) => res.data),

  // Catalog: edit product
  getProduct: (id: string) => httpClient.get<Product>(`/admin/products/${id}`).then((res) => res.data),
  updateProduct: (id: string, payload: UpdateProductPayload) =>
    httpClient.patch<Product>(`/admin/products/${id}`, payload).then((res) => res.data),

  // Customers
  listCustomers: () => httpClient.get<CustomerWithStats[]>('/admin/customers').then((res) => res.data),
};
