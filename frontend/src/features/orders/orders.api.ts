import { httpClient } from '@/lib/http-client';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  city: string;
  zip: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

export const ordersApi = {
  mine: () => httpClient.get<Order[]>('/orders/mine').then((res) => res.data),
  getById: (id: string) => httpClient.get<Order>(`/orders/${id}`).then((res) => res.data),
  create: (payload: CreateOrderPayload) =>
    httpClient.post<Order>('/orders', payload).then((res) => res.data),
};
