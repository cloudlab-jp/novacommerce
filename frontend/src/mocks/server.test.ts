import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './server';
import { __resetMockSession } from './handlers';
import { httpClient } from '@/lib/http-client';
import { authApi } from '@/features/auth/auth.api';
import { catalogApi } from '@/features/catalog/catalog.api';
import { ordersApi } from '@/features/orders/orders.api';
import { adminApi } from '@/features/admin/admin.api';
import { addressesApi } from '@/features/addresses/addresses.api';

// Este archivo es la prueba real de que "el mock funciona": no solo que los
// handlers existen, sino que una llamada real de Axios (con baseURL "/api",
// tal como corre en el navegador) recibe la respuesta mockeada de punta a
// punta, pasando por los mismos interceptores de http-client.ts.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  __resetMockSession();
});
afterAll(() => server.close());

describe('MSW mocking pipeline (auth + catalog)', () => {
  it('GET /api/categories returns the seeded categories', async () => {
    const categories = await catalogApi.categories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories.map((c) => c.slug)).toContain('electronics');
  });

  it('GET /api/products returns the seeded products with images', async () => {
    const products = await catalogApi.list();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('price');
    expect(products[0].images.length).toBeGreaterThan(0);
  });

  it('GET /api/products/:slug returns a single product with its gallery', async () => {
    const product = await catalogApi.getBySlug('wireless-mouse');
    expect(product.name).toBe('Wireless Mouse');
    expect(product.images).toHaveLength(3);
  });

  it('GET /api/products filters by categoryId', async () => {
    const categories = await catalogApi.categories();
    const electronics = categories.find((c) => c.slug === 'electronics')!;
    const filtered = await catalogApi.list({ categoryId: electronics.id });
    expect(filtered.every((p) => p.categoryId === electronics.id)).toBe(true);
  });

  it('POST /api/auth/login with valid seed credentials returns the user', async () => {
    const user = await authApi.login({ email: 'admin@novacommerce.dev', password: 'password123' });
    expect(user.role).toBe('admin');
  });

  it('POST /api/auth/login with wrong password returns a normalized ApiError (401)', async () => {
    await expect(
      authApi.login({ email: 'admin@novacommerce.dev', password: 'wrong' }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('GET /api/auth/me is 401 before login (no session yet)', async () => {
    await expect(authApi.me()).rejects.toMatchObject({ status: 401 });
  });

  it('httpClient base URL is relative, so it resolves against the app origin (jsdom/browser), not an external port', () => {
    // Esta es la regresión concreta que rompió el mock la vez pasada:
    // un VITE_API_URL absoluto a otro puerto saca la request del origen
    // que MSW intercepta.
    expect(httpClient.defaults.baseURL).toBe('/api');
  });
});

describe('Checkout flow (create order + ownership)', () => {
  it('cannot create an order without a session', async () => {
    await expect(
      ordersApi.create({
        items: [{ productId: 'p1', name: 'Wireless Mouse', quantity: 1, price: 24.99 }],
        shippingAddress: { fullName: 'Test', line1: 'Calle 1', city: 'Cali', zip: '760001', country: 'Colombia' },
      }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('creates an order for the logged-in customer and it shows up in "mine"', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });

    const order = await ordersApi.create({
      items: [{ productId: 'p1', name: 'Wireless Mouse', quantity: 2, price: 24.99 }],
      shippingAddress: { fullName: 'Carla Customer', line1: 'Calle 1', city: 'Cali', zip: '760001', country: 'Colombia' },
    });

    expect(order.status).toBe('pending');
    expect(order.total).toBeCloseTo(49.98);

    const mine = await ordersApi.mine();
    expect(mine.some((o) => o.id === order.id)).toBe(true);
  });

  it('a customer cannot view another customer\'s order detail (ownership check)', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });
    // ord_1003 pertenece a un customerId distinto (u_other) en los datos semilla.
    await expect(ordersApi.getById('ord_1003')).rejects.toMatchObject({ status: 403 });
  });

  it('order_manager can view any order, including one that is not theirs', async () => {
    await authApi.login({ email: 'orders@novacommerce.dev', password: 'password123' });
    const order = await ordersApi.getById('ord_1003');
    expect(order.id).toBe('ord_1003');
  });
});

describe('Admin catalog management (categories, brands, edit product)', () => {
  it('customer cannot create a category (403)', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });
    await expect(adminApi.createCategory({ name: 'Toys', description: 'Fun stuff' })).rejects.toMatchObject({
      status: 403,
    });
  });

  it('catalog_manager can create a category and it shows up in the public list', async () => {
    await authApi.login({ email: 'catalog@novacommerce.dev', password: 'password123' });
    const created = await adminApi.createCategory({ name: 'Toys', description: 'Fun stuff' });
    expect(created.name).toBe('Toys');

    const categories = await catalogApi.categories();
    expect(categories.some((c) => c.id === created.id)).toBe(true);
  });

  it('catalog_manager can create a brand', async () => {
    await authApi.login({ email: 'catalog@novacommerce.dev', password: 'password123' });
    const brand = await adminApi.createBrand({ name: 'AcmeCo' });
    expect(brand.name).toBe('AcmeCo');
  });

  it('catalog_manager can edit a product and the change is reflected in the public catalog', async () => {
    await authApi.login({ email: 'catalog@novacommerce.dev', password: 'password123' });
    const product = await adminApi.getProduct('p1');
    const updated = await adminApi.updateProduct(product.id, { price: 29.99 });
    expect(updated.price).toBe(29.99);

    const fromCatalog = await catalogApi.getBySlug('wireless-mouse');
    expect(fromCatalog.price).toBe(29.99);
  });

  it('inventory_manager cannot edit a product (wrong permission for catalog:manage)', async () => {
    await authApi.login({ email: 'inventory@novacommerce.dev', password: 'password123' });
    await expect(adminApi.updateProduct('p1', { price: 1 })).rejects.toMatchObject({ status: 403 });
  });
});

describe('Admin customers list', () => {
  it('order_manager sees customers with aggregated order stats', async () => {
    await authApi.login({ email: 'orders@novacommerce.dev', password: 'password123' });
    const customers = await adminApi.listCustomers();
    const carla = customers.find((c) => c.email === 'customer@novacommerce.dev');
    expect(carla).toBeDefined();
    expect(carla?.ordersCount).toBeGreaterThanOrEqual(0);
  });

  it('catalog_manager cannot see the customers list (wrong permission)', async () => {
    await authApi.login({ email: 'catalog@novacommerce.dev', password: 'password123' });
    await expect(adminApi.listCustomers()).rejects.toMatchObject({ status: 403 });
  });
});

describe('Customer profile + addresses', () => {
  it('a customer can update their own profile', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });
    const updated = await authApi.updateMe({ name: 'Carla C. Updated' });
    expect(updated.name).toBe('Carla C. Updated');
  });

  it('changing password fails with the wrong current password', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });
    await expect(
      authApi.changePassword({ currentPassword: 'wrong', newPassword: 'newpass123' }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('a customer can create, update and delete their own address', async () => {
    await authApi.login({ email: 'customer@novacommerce.dev', password: 'password123' });

    const created = await addressesApi.create({
      label: 'Oficina',
      fullName: 'Carla Customer',
      line1: 'Cra 10 # 5-20',
      city: 'Cali',
      zip: '760001',
      country: 'Colombia',
      isDefault: false,
    });
    expect(created.id).toBeDefined();

    const updated = await addressesApi.update(created.id, { city: 'Palmira' });
    expect(updated.city).toBe('Palmira');

    const listBefore = await addressesApi.list();
    expect(listBefore.some((a) => a.id === created.id)).toBe(true);

    await addressesApi.remove(created.id);
    const listAfter = await addressesApi.list();
    expect(listAfter.some((a) => a.id === created.id)).toBe(false);
  });
});
