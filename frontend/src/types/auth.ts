// Contrato RBAC — única fuente de verdad consumida por:
//  - ProtectedRoute (guard de rutas)
//  - Sidebar admin (filtrado de navegación)
//  - Componentes que ocultan/deshabilitan acciones (ej. botón "Create Product")

export type Role =
  | 'guest'
  | 'customer'
  | 'catalog_manager'
  | 'inventory_manager'
  | 'order_manager'
  | 'admin';

// Permisos derivados de la matriz de 004-navigation.md / 002-user-flows.md
export type Permission =
  | 'catalog:browse'
  | 'catalog:manage' // Create/Edit Product, Categories, Brands
  | 'inventory:manage' // Update Stock
  | 'orders:manage' // Manage Orders (status, cancelaciones)
  | 'users:manage'; // Users & Roles

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ['catalog:browse'],
  customer: ['catalog:browse'],
  catalog_manager: ['catalog:browse', 'catalog:manage'],
  inventory_manager: ['catalog:browse', 'inventory:manage'],
  order_manager: ['catalog:browse', 'orders:manage'],
  admin: [
    'catalog:browse',
    'catalog:manage',
    'inventory:manage',
    'orders:manage',
    'users:manage',
  ],
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// El backend firma el access token con estas claims (decodificadas solo para lectura
// de UI; la verificación real de la firma ocurre siempre en el backend).
export interface AccessTokenClaims {
  sub: string;
  email: string;
  name: string;
  role: Role;
  exp: number;
  iat: number;
}
