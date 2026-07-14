import type { Role, User } from '@/types/auth';

// Contraseña para TODOS los usuarios semilla: "password123"
// (solo para el entorno mock — nunca hardcodear credenciales así contra un backend real)
export const MOCK_PASSWORD = 'password123';

interface SeedUser extends User {
  password: string;
}

export const seedUsers: SeedUser[] = [
  { id: 'u_customer', email: 'customer@novacommerce.dev', name: 'Carla Customer', role: 'customer', password: MOCK_PASSWORD },
  { id: 'u_catalog', email: 'catalog@novacommerce.dev', name: 'Carlos Catalog', role: 'catalog_manager', password: MOCK_PASSWORD },
  { id: 'u_inventory', email: 'inventory@novacommerce.dev', name: 'Iván Inventory', role: 'inventory_manager', password: MOCK_PASSWORD },
  { id: 'u_orders', email: 'orders@novacommerce.dev', name: 'Olga Orders', role: 'order_manager', password: MOCK_PASSWORD },
  { id: 'u_admin', email: 'admin@novacommerce.dev', name: 'Ana Admin', role: 'admin', password: MOCK_PASSWORD },
];

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: 'cat_electronics', slug: 'electronics', name: 'Electronics', description: 'Gadgets, computers, and accessories.', productCount: 3 },
  { id: 'cat_apparel', slug: 'apparel', name: 'Apparel', description: 'Clothing for every season.', productCount: 2 },
  { id: 'cat_home', slug: 'home', name: 'Home & Living', description: 'Everything for your space.', productCount: 2 },
  { id: 'cat_sports', slug: 'sports', name: 'Sports', description: 'Gear for staying active.', productCount: 1 },
];

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryId: string;
  description: string;
  images: string[];
}

// picsum.photos con seed fijo por producto -> misma imagen siempre, sin
// depender de tener assets locales mientras no hay backend/CDN real.
function seededImages(seed: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/800`);
}

export const products: Product[] = [
  { id: 'p1', name: 'Wireless Mouse', slug: 'wireless-mouse', price: 24.99, stock: 120, categoryId: 'cat_electronics', description: 'Ergonomic wireless mouse with silent clicks.', images: seededImages('wireless-mouse', 3) },
  { id: 'p2', name: 'Mechanical Keyboard', slug: 'mechanical-keyboard', price: 89.99, stock: 45, categoryId: 'cat_electronics', description: 'Hot-swappable mechanical keyboard, tactile switches.', images: seededImages('mechanical-keyboard', 3) },
  { id: 'p3', name: '4K Monitor', slug: '4k-monitor', price: 349.0, stock: 12, categoryId: 'cat_electronics', description: '27" 4K IPS monitor, 144Hz.', images: seededImages('4k-monitor', 3) },
  { id: 'p4', name: 'Running Shoes', slug: 'running-shoes', price: 59.99, stock: 0, categoryId: 'cat_sports', description: 'Lightweight running shoes with breathable mesh.', images: seededImages('running-shoes', 3) },
  { id: 'p5', name: 'Denim Jacket', slug: 'denim-jacket', price: 74.5, stock: 30, categoryId: 'cat_apparel', description: 'Classic denim jacket, unisex fit.', images: seededImages('denim-jacket', 3) },
  { id: 'p6', name: 'Cotton T-Shirt', slug: 'cotton-tshirt', price: 19.99, stock: 200, categoryId: 'cat_apparel', description: '100% organic cotton t-shirt.', images: seededImages('cotton-tshirt', 3) },
  { id: 'p7', name: 'Ceramic Vase', slug: 'ceramic-vase', price: 34.0, stock: 18, categoryId: 'cat_home', description: 'Handmade ceramic vase, matte finish.', images: seededImages('ceramic-vase', 3) },
  { id: 'p8', name: 'Scented Candle Set', slug: 'scented-candle-set', price: 27.5, stock: 60, categoryId: 'cat_home', description: 'Set of 3 soy wax candles.', images: seededImages('scented-candle-set', 3) },
];

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: { productId: string; name: string; quantity: number; price: number; image?: string }[];
  shippingAddress?: {
    fullName: string;
    line1: string;
    city: string;
    zip: string;
    country: string;
  };
}

export const orders: Order[] = [
  {
    id: 'ord_1001',
    customerId: 'u_customer',
    customerName: 'Carla Customer',
    status: 'delivered',
    total: 114.98,
    createdAt: '2026-06-28T14:20:00Z',
    items: [
      { productId: 'p1', name: 'Wireless Mouse', quantity: 1, price: 24.99 },
      { productId: 'p2', name: 'Mechanical Keyboard', quantity: 1, price: 89.99 },
    ],
  },
  {
    id: 'ord_1002',
    customerId: 'u_customer',
    customerName: 'Carla Customer',
    status: 'processing',
    total: 59.99,
    createdAt: '2026-07-05T09:10:00Z',
    items: [{ productId: 'p4', name: 'Running Shoes', quantity: 1, price: 59.99 }],
  },
  {
    id: 'ord_1003',
    customerId: 'u_other',
    customerName: 'Diego Duarte',
    status: 'pending',
    total: 34.0,
    createdAt: '2026-07-09T18:45:00Z',
    items: [{ productId: 'p7', name: 'Ceramic Vase', quantity: 1, price: 34.0 }],
  },
];

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export const brands: Brand[] = [
  { id: 'brand_novatech', slug: 'novatech', name: 'NovaTech' },
  { id: 'brand_urbanwear', slug: 'urbanwear', name: 'UrbanWear' },
  { id: 'brand_homely', slug: 'homely', name: 'Homely' },
];

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export const addresses: Address[] = [
  {
    id: 'addr_1',
    userId: 'u_customer',
    label: 'Casa',
    fullName: 'Carla Customer',
    line1: 'Calle 5 # 23-10',
    city: 'Tuluá',
    zip: '763021',
    country: 'Colombia',
    isDefault: true,
  },
];

export const seedRoles: Role[] = ['customer', 'catalog_manager', 'inventory_manager', 'order_manager', 'admin'];
