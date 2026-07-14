# NovaCommerce — Front End

Cloud-native e-commerce platform. Reference implementation de CloudLab JP.

## Stack

React 19 · TypeScript · Vite · React Router 7 · TanStack Query · TanStack Table ·
Zustand · Axios · Tailwind CSS v4 · Lucide React · Recharts · Motion · Vitest ·
React Testing Library · Playwright.

## Datos quemados mientras no hay backend (MSW)

Todas las llamadas Axios (`httpClient`) son interceptadas a nivel de red por
[MSW](https://mswjs.io) cuando `VITE_USE_MOCKS=true` (ver `.env.example`). Esto
significa que el interceptor de 401, el refresh token, y el manejo centralizado de
errores se siguen ejecutando exactamente igual que contra un backend real — lo único
que cambia es quién responde el request.

- **Dónde viven los datos:** `src/mocks/data.ts` (usuarios semilla, productos,
  categorías, órdenes).
- **Dónde viven los endpoints:** `src/mocks/handlers.ts` — un handler por endpoint
  REST, incluyendo validación de rol (401/403) igual que lo haría el backend.
- **"Sesión" sin cookies reales:** como un `Response` sintético de un Service Worker
  no puede setear cookies `HttpOnly` de verdad (restricción del navegador, no de
  MSW), la sesión se guarda en una variable en memoria dentro del propio worker.
  Sobrevive a recargas de página mientras el Service Worker siga activo. Es
  intencional y solo aplica en modo mock — el flujo de cookies reales
  (`withCredentials`, `Set-Cookie`) ya está implementado en `http-client.ts` y
  funcionará sin cambios contra el backend real.
- **Para apagar los mocks:** `VITE_USE_MOCKS=false` en `.env` una vez el backend
  esté disponible en `VITE_API_URL`. No hay que tocar ningún `*.api.ts`.

### Credenciales de prueba (todas usan la contraseña `password123`)

| Rol | Email |
|---|---|
| Customer | `customer@novacommerce.dev` |
| Catalog Manager | `catalog@novacommerce.dev` |
| Inventory Manager | `inventory@novacommerce.dev` |
| Order Manager | `orders@novacommerce.dev` |
| Admin | `admin@novacommerce.dev` |

Registrarte desde `/register` también funciona — crea un usuario nuevo con rol
`customer` en memoria.

## Arranque

```bash
npm install
cp .env.example .env      # ajusta VITE_API_URL al backend real
npm run dev                # http://localhost:5173
```

```bash
npm run build               # type-check + build de producción
npm run test                # unit tests (Vitest)
npm run test:e2e            # e2e (Playwright) — requiere `npx playwright install` una vez
npm run lint                 # oxlint
```

> **Nota sobre Playwright:** el navegador de Chromium no se descargó en este entorno
> por restricciones de red de sandbox. Antes de correr `test:e2e` localmente, ejecuta
> `npx playwright install chromium` una sola vez.

## Estructura de carpetas

```
src/
├── app/                  # (reservado) configuración transversal de la app
├── components/           # componentes de UI puros, reutilizables entre features
│   └── ui/                # primitives (Skeleton, FullPageSkeleton, futuros shadcn/ui)
├── features/              # un folder por dominio de negocio (screaming architecture)
│   ├── auth/                # login, register, hooks de sesión
│   ├── catalog/              # landing, catálogo, productos (vista pública)
│   ├── customer/              # dashboard, orders, cart, checkout (vista cliente)
│   ├── admin/                  # products, inventory, orders, users (vista admin)
│   └── system/                  # 403 / 404 / 500
├── layouts/                # 4 layouts independientes: Public, Customer, Admin, Minimal
├── lib/                     # http-client (Axios), query-client (TanStack Query), utils
├── routes/                   # AppRouter, ProtectedRoute/GuestOnlyRoute, helper de lazy loading
├── stores/                    # Zustand (solo auth.store por ahora)
├── types/                      # contrato RBAC (Role, Permission) — única fuente de verdad
└── test/                        # setup de Vitest
```

Cada `feature/` es dueña de su propia API (`*.api.ts`) y sus hooks de datos
(`*.hooks.ts`) — nada de un `services/` global compartido. Cuando el backend
evolucione de Modular Monolith a microservicios, cada feature ya está aislada y su
`*.api.ts` es el único punto que cambiaría.

## Decisiones de arquitectura clave

### 1. Auth: cookies HttpOnly, nunca localStorage

`auth.store.ts` (Zustand) **nunca** guarda el access/refresh token — solo guarda el
`User` derivado de `/auth/me`. Los tokens los escribe y lee el backend vía
`Set-Cookie` con `HttpOnly; Secure; SameSite`. El cliente Axios usa
`withCredentials: true` para que el navegador los adjunte automáticamente. Esto
elimina la superficie de ataque XSS→robo de token que existe con `localStorage`.

### 2. RBAC: un solo contrato, tres consumidores

`src/types/auth.ts` define `Role`, `Permission` y `roleHasPermission()`. Ese mismo
`can(permission)` (expuesto por el store) es consumido por:

- `ProtectedRoute` (`routes/ProtectedRoute.tsx`) — bloquea rutas.
- `AdminLayout` sidebar — filtra qué links se muestran.
- Cualquier botón/acción puntual (ej. "Create Product") que necesite ocultarse.

Nunca hay una segunda lista de permisos hardcodeada en otro lugar. Ver
`src/types/auth.test.ts` para la matriz de roles cubierta por tests.

### 3. Refresh token single-flight

`lib/http-client.ts` implementa el interceptor de 401 con una promesa compartida
(`refreshPromise`) para que N requests en paralelo que reciben 401 solo disparen
**un** `/auth/refresh`, no uno por request. Si el refresh también falla, se dispara
`auth:session-expired` (evento global) y `App.tsx` lo traduce en un toast + logout.

### 4. Nested routes + layouts 100% independientes

`AppRouter.tsx` no tiene un shell condicional único — cada sección (`Public`,
`Customer`, `Admin`, `Minimal`) es su propio subárbol de rutas con su propio layout.
Los guards (`ProtectedRoute`, `GuestOnlyRoute`) se insertan como nodos padres de esos
subárboles, no como `if` dentro de cada página.

### 5. Lazy loading sin boilerplate repetido

`routes/lazy.tsx` centraliza `React.lazy + Suspense` en un helper (`lazyRoute`) para
que cada ruta lazy-loaded comparta el mismo fallback (`FullPageSkeleton`) sin repetir
`<Suspense fallback={...}>` 30 veces. Confirmado en el build: cada página produce su
propio chunk (`ProductsPage-*.js`, `AdminDashboardPage-*.js`, etc.).

### 6. Loading: skeletons, no spinners

No hay ni un `<Spinner />` global. `CatalogPage` es el ejemplo de referencia:
mientras `useProducts()` está `isPending`, se renderiza una grilla de `<Skeleton />`
con la misma forma que las cards reales.

## RBAC matrix implementada

| Feature | Guest | Customer | Catalog Manager | Inventory Manager | Order Manager | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse Catalog | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Product | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Update Stock | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Manage Orders | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

## Qué está completo

**Las 33 pantallas de `003-screens.md` están construidas y funcionando**, incluyendo:

- **Compra end-to-end**: catálogo → carrito (persistido, quick-add desde card) →
  checkout multi-paso (dirección → pago mock → revisión) → creación de orden real →
  confirmación → aparece en "My Orders" y en el detalle con ownership check.
- **Customer completo**: Dashboard, Profile (editar nombre/email), Addresses (CRUD
  completo con dirección predeterminada), Wishlist (persistida, toggle desde
  cualquier card de producto), Settings (cambio de contraseña + preferencias).
- **Admin, las 4 acciones de la matriz RBAC + catálogo completo**: Create/Edit
  Product, Categories y Brands (creación real), Update Stock (edición inline en
  Inventory), Manage Orders (cambio de estado), Users & Roles (cambio de rol),
  Customers (con órdenes y gasto total agregado), Reports (Recharts derivado de
  orders + products, sin endpoint nuevo — son los mismos datos ya expuestos).
- **28 tests** cubriendo auth, catálogo, checkout + ownership, gestión de catálogo
  admin, y CRUD de direcciones/perfil (`src/mocks/server.test.ts`,
  `src/types/auth.test.ts`).

## Qué falta (siguiente iteración)

- Backend real (Modular Monolith) que reemplace los handlers de MSW endpoint por
  endpoint — el contrato de cada `*.api.ts` ya está definido, así que es
  implementar el mismo shape en el servidor.
- Migrar los componentes base a `shadcn/ui` real (`npx shadcn@latest add button card
  dialog ...`) — hoy los formularios usan Tailwind plano para no acoplar el scaffold
  a decisiones de tema que quieras ajustar en Figma primero.
- Imágenes responsivas (`srcset`) — tiene sentido una vez definas qué CDN de imágenes
  vas a usar en el backend real; con `picsum.photos` de mock no aporta nada.
- La wishlist usa `maxStock: 999` como placeholder al agregar al carrito desde esa
  pantalla, porque no re-consulta el stock real del producto en ese punto — un
  detalle menor a resolver cuando haya backend (traer el stock actual antes de
  agregar).
