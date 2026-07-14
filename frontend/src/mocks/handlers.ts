import { http, HttpResponse, delay } from 'msw';
import {
  seedUsers,
  categories,
  products,
  orders,
  brands,
  addresses,
  type Order,
  type Brand,
  type Address,
} from './data';
import type { User } from '@/types/auth';

// ---------------------------------------------------------------------------
// Estado de "sesión" en memoria, a nivel de módulo del Service Worker.
// Esto simula el rol que jugaría la cookie HttpOnly del backend real: el
// front NUNCA lo lee directamente, solo pega a /auth/me y /auth/login.
// Sobrevive a recargas de página (el SW sigue activo) pero no a cerrar el
// tab del todo — comportamiento suficiente para desarrollar sin backend.
// ---------------------------------------------------------------------------
let currentUserId: string | null = null;
const registeredUsers: User[] = [...seedUsers.map(({ password: _password, ...u }) => u)];

/** Solo para tests: vuelve la "sesión in-memory" al estado inicial. */
export function __resetMockSession() {
  currentUserId = null;
}

function findUserById(id: string | null): User | undefined {
  return registeredUsers.find((u) => u.id === id);
}

/** Devuelve el usuario si tiene permiso de gestión de catálogo, o una Response de error lista para retornar. */
function requireCatalogManager(): { user: User } | { error: ReturnType<typeof HttpResponse.json> } {
  const user = findUserById(currentUserId);
  if (!user) return { error: HttpResponse.json({ message: 'No autenticado' }, { status: 401 }) };
  if (user.role !== 'catalog_manager' && user.role !== 'admin') {
    return { error: HttpResponse.json({ message: 'No autorizado' }, { status: 403 }) };
  }
  return { user };
}

const API = '/api';

export const handlers = [
  // ---- AUTH ----
  http.post(`${API}/auth/login`, async ({ request }) => {
    await delay(300);
    const { email, password } = (await request.json()) as { email: string; password: string };
    const seed = seedUsers.find((u) => u.email === email);

    if (!seed || password !== seed.password) {
      return HttpResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    currentUserId = seed.id;
    const { password: _pw, ...user } = seed;
    return HttpResponse.json(user);
  }),

  http.post(`${API}/auth/register`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { name: string; email: string; password: string };

    if (registeredUsers.some((u) => u.email === body.email)) {
      return HttpResponse.json({ message: 'Ese email ya está registrado' }, { status: 409 });
    }

    const newUser: User = {
      id: `u_${crypto.randomUUID().slice(0, 8)}`,
      email: body.email,
      name: body.name,
      role: 'customer',
    };
    registeredUsers.push(newUser);
    currentUserId = newUser.id;
    return HttpResponse.json(newUser);
  }),

  http.post(`${API}/auth/logout`, async () => {
    await delay(150);
    currentUserId = null;
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${API}/auth/me`, async () => {
    await delay(200);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    return HttpResponse.json(user);
  }),

  http.post(`${API}/auth/refresh`, async () => {
    await delay(150);
    if (!currentUserId) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    return HttpResponse.json({ ok: true });
  }),

  http.patch(`${API}/auth/me`, async ({ request }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const body = (await request.json()) as { name?: string; email?: string };
    if (body.email && registeredUsers.some((u) => u.email === body.email && u.id !== user.id)) {
      return HttpResponse.json({ message: 'Ese email ya está en uso' }, { status: 409 });
    }
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    return HttpResponse.json(user);
  }),

  // Mock de cambio de contraseña — no hay hashing real que validar, solo
  // simula la verificación de "contraseña actual" contra la semilla.
  http.post(`${API}/auth/change-password`, async ({ request }) => {
    await delay(400);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    const { currentPassword } = (await request.json()) as { currentPassword: string; newPassword: string };
    const seed = seedUsers.find((u) => u.id === user.id);
    if (seed && currentPassword !== seed.password) {
      return HttpResponse.json({ message: 'La contraseña actual no es correcta' }, { status: 401 });
    }
    return HttpResponse.json({ ok: true });
  }),

  // ---- CATALOG (público) ----
  http.get(`${API}/products`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase();
    const categoryId = url.searchParams.get('categoryId');

    let result = products;
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q));
    if (categoryId) result = result.filter((p) => p.categoryId === categoryId);

    return HttpResponse.json(result);
  }),

  http.get(`${API}/products/:slug`, async ({ params }) => {
    await delay(300);
    const product = products.find((p) => p.slug === params.slug);
    if (!product) return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.get(`${API}/categories`, async () => {
    await delay(300);
    return HttpResponse.json(categories);
  }),

  http.get(`${API}/brands`, async () => {
    await delay(300);
    return HttpResponse.json(brands);
  }),

  http.post(`${API}/admin/categories`, async ({ request }) => {
    await delay(300);
    const gate = requireCatalogManager();
    if ('error' in gate) return gate.error;

    const body = (await request.json()) as { name: string; description: string };
    const newCategory = {
      id: `cat_${crypto.randomUUID().slice(0, 8)}`,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      name: body.name,
      description: body.description,
      productCount: 0,
    };
    categories.push(newCategory);
    return HttpResponse.json(newCategory, { status: 201 });
  }),

  http.post(`${API}/admin/brands`, async ({ request }) => {
    await delay(300);
    const gate = requireCatalogManager();
    if ('error' in gate) return gate.error;

    const body = (await request.json()) as { name: string };
    const newBrand: Brand = {
      id: `brand_${crypto.randomUUID().slice(0, 8)}`,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      name: body.name,
    };
    brands.push(newBrand);
    return HttpResponse.json(newBrand, { status: 201 });
  }),

  http.get(`${API}/admin/products/:id`, async ({ params }) => {
    await delay(300);
    const gate = requireCatalogManager();
    if ('error' in gate) return gate.error;

    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.patch(`${API}/admin/products/:id`, async ({ params, request }) => {
    await delay(400);
    const gate = requireCatalogManager();
    if ('error' in gate) return gate.error;

    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });

    const body = (await request.json()) as Partial<Pick<typeof product, 'name' | 'price' | 'description' | 'categoryId'>>;
    Object.assign(product, body);
    return HttpResponse.json(product);
  }),

  // ---- CUSTOMER: mis órdenes (ownership check) ----
  http.get(`${API}/orders/mine`, async () => {
    await delay(350);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    return HttpResponse.json(
      orders.filter((o) => o.customerId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  }),

  // Crea una orden a partir del carrito (checkout). Requiere sesión.
  http.post(`${API}/orders`, async ({ request }) => {
    await delay(500);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const body = (await request.json()) as {
      items: { productId: string; name: string; quantity: number; price: number; image?: string }[];
      shippingAddress: Order['shippingAddress'];
    };

    if (!body.items?.length) {
      return HttpResponse.json({ message: 'El carrito está vacío' }, { status: 422 });
    }

    const total = body.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      customerId: user.id,
      customerName: user.name,
      status: 'pending',
      total,
      createdAt: new Date().toISOString(),
      items: body.items,
      shippingAddress: body.shippingAddress,
    };

    orders.unshift(newOrder);

    // Descuenta stock — mismo efecto que tendría el backend real.
    for (const item of body.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) product.stock = Math.max(0, product.stock - item.quantity);
    }

    return HttpResponse.json(newOrder, { status: 201 });
  }),

  // Detalle de una orden — ownership check: solo el dueño o roles internos con
  // permiso de gestión de órdenes pueden verla.
  http.get(`${API}/orders/:id`, async ({ params }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const order = orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: 'Orden no encontrada' }, { status: 404 });

    const isOwner = order.customerId === user.id;
    const canManage = user.role === 'order_manager' || user.role === 'admin';
    if (!isOwner && !canManage) {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }

    return HttpResponse.json(order);
  }),

  // ---- CUSTOMER: direcciones (CRUD sobre las propias) ----
  http.get(`${API}/addresses`, async () => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    return HttpResponse.json(addresses.filter((a) => a.userId === user.id));
  }),

  http.post(`${API}/addresses`, async ({ request }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const body = (await request.json()) as Omit<Address, 'id' | 'userId'>;
    const newAddress: Address = { ...body, id: `addr_${crypto.randomUUID().slice(0, 8)}`, userId: user.id };

    if (newAddress.isDefault) {
      addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    }
    addresses.push(newAddress);
    return HttpResponse.json(newAddress, { status: 201 });
  }),

  http.patch(`${API}/addresses/:id`, async ({ params, request }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const address = addresses.find((a) => a.id === params.id);
    if (!address) return HttpResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    if (address.userId !== user.id) return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });

    const body = (await request.json()) as Partial<Omit<Address, 'id' | 'userId'>>;
    if (body.isDefault) {
      addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    }
    Object.assign(address, body);
    return HttpResponse.json(address);
  }),

  http.delete(`${API}/addresses/:id`, async ({ params }) => {
    await delay(250);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });

    const index = addresses.findIndex((a) => a.id === params.id);
    if (index === -1) return HttpResponse.json({ message: 'Dirección no encontrada' }, { status: 404 });
    if (addresses[index].userId !== user.id) return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });

    addresses.splice(index, 1);
    return HttpResponse.json({ ok: true });
  }),

  // ---- ADMIN: inventory (Inventory Manager, Admin) ----
  http.patch(`${API}/admin/inventory/:productId`, async ({ params, request }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (user.role !== 'inventory_manager' && user.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    const { stock } = (await request.json()) as { stock: number };
    const product = products.find((p) => p.id === params.productId);
    if (!product) return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    product.stock = stock;
    return HttpResponse.json(product);
  }),

  // ---- ADMIN: orders (Order Manager, Admin) ----
  http.get(`${API}/admin/orders`, async () => {
    await delay(400);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (user.role !== 'order_manager' && user.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    return HttpResponse.json(orders);
  }),

  http.patch(`${API}/admin/orders/:id`, async ({ params, request }) => {
    await delay(300);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (user.role !== 'order_manager' && user.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    const { status } = (await request.json()) as { status: Order['status'] };
    const order = orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: 'Orden no encontrada' }, { status: 404 });
    order.status = status;
    return HttpResponse.json(order);
  }),

  // Clientes + cantidad de órdenes (join simple en memoria) — visible para
  // roles con permiso de gestión de órdenes.
  http.get(`${API}/admin/customers`, async () => {
    await delay(400);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (user.role !== 'order_manager' && user.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    const customers = registeredUsers
      .filter((u) => u.role === 'customer')
      .map((u) => ({
        ...u,
        ordersCount: orders.filter((o) => o.customerId === u.id).length,
        totalSpent: orders.filter((o) => o.customerId === u.id).reduce((sum, o) => sum + o.total, 0),
      }));
    return HttpResponse.json(customers);
  }),

  // ---- ADMIN: users & roles (Admin only) ----
  http.get(`${API}/admin/users`, async () => {
    await delay(350);
    const user = findUserById(currentUserId);
    if (!user) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (user.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    return HttpResponse.json(registeredUsers);
  }),

  http.patch(`${API}/admin/users/:id/role`, async ({ params, request }) => {
    await delay(300);
    const actor = findUserById(currentUserId);
    if (!actor) return HttpResponse.json({ message: 'No autenticado' }, { status: 401 });
    if (actor.role !== 'admin') {
      return HttpResponse.json({ message: 'No autorizado' }, { status: 403 });
    }
    const { role } = (await request.json()) as { role: User['role'] };
    const target = registeredUsers.find((u) => u.id === params.id);
    if (!target) return HttpResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    target.role = role;
    return HttpResponse.json(target);
  }),
];
