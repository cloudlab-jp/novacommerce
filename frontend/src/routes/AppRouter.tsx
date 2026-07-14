import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { CustomerLayout } from '@/layouts/CustomerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { MinimalLayout } from '@/layouts/MinimalLayout';
import { ProtectedRoute, GuestOnlyRoute } from './ProtectedRoute';
import { lazyRoute } from './lazy';

const router = createBrowserRouter([
  // ---- Public (Guest) ----
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: lazyRoute(() => import('@/features/catalog/LandingPage')) },
      { path: '/catalog', element: lazyRoute(() => import('@/features/catalog/CatalogPage')) },
      { path: '/products/:slug', element: lazyRoute(() => import('@/features/catalog/ProductDetailPage')) },
      { path: '/categories', element: lazyRoute(() => import('@/features/catalog/CategoriesPage')) },
      { path: '/categories/:slug', element: lazyRoute(() => import('@/features/catalog/CategoryDetailPage')) },
      { path: '/search', element: lazyRoute(() => import('@/features/catalog/SearchResultsPage')) },
      { path: '/about', element: lazyRoute(() => import('@/features/catalog/AboutPage')) },
      { path: '/contact', element: lazyRoute(() => import('@/features/catalog/ContactPage')) },
      { path: '/faq', element: lazyRoute(() => import('@/features/catalog/FaqPage')) },

      // Login/Register: solo accesibles si NO hay sesión.
      {
        element: <GuestOnlyRoute />,
        children: [
          { path: '/login', element: lazyRoute(() => import('@/features/auth/LoginPage')) },
          { path: '/register', element: lazyRoute(() => import('@/features/auth/RegisterPage')) },
        ],
      },

      // Cart es público (carrito de invitado) pero vive bajo el layout público.
      { path: '/cart', element: lazyRoute(() => import('@/features/customer/CartPage')) },
    ],
  },

  // ---- Customer (requiere auth, sin permiso extra) ----
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: '/dashboard', element: lazyRoute(() => import('@/features/customer/DashboardPage')) },
          { path: '/dashboard/profile', element: lazyRoute(() => import('@/features/customer/ProfilePage')) },
          { path: '/dashboard/addresses', element: lazyRoute(() => import('@/features/customer/AddressesPage')) },
          { path: '/dashboard/wishlist', element: lazyRoute(() => import('@/features/customer/WishlistPage')) },
          { path: '/dashboard/settings', element: lazyRoute(() => import('@/features/customer/SettingsPage')) },
          { path: '/dashboard/orders', element: lazyRoute(() => import('@/features/customer/OrdersPage')) },
          { path: '/dashboard/orders/:orderId', element: lazyRoute(() => import('@/features/customer/OrderDetailPage')) },
          { path: '/checkout', element: lazyRoute(() => import('@/features/customer/CheckoutPage')) },
          { path: '/checkout/confirmation/:orderId', element: lazyRoute(() => import('@/features/customer/OrderConfirmationPage')) },
        ],
      },
    ],
  },

  // ---- Admin (requiere auth + permiso específico por sub-árbol) ----
  {
    element: <AdminLayout />,
    children: [
      {
        // Dashboard visible para cualquier rol interno -> solo exige auth.
        element: <ProtectedRoute />,
        children: [
          { path: '/admin', element: lazyRoute(() => import('@/features/admin/AdminDashboardPage')) },
        ],
      },
      {
        element: <ProtectedRoute permission="catalog:manage" />,
        children: [
          { path: '/admin/products', element: lazyRoute(() => import('@/features/admin/ProductsPage')) },
          { path: '/admin/products/new', element: lazyRoute(() => import('@/features/admin/CreateProductPage')) },
          { path: '/admin/products/:id/edit', element: lazyRoute(() => import('@/features/admin/EditProductPage')) },
          { path: '/admin/categories', element: lazyRoute(() => import('@/features/admin/CategoriesPage')) },
          { path: '/admin/brands', element: lazyRoute(() => import('@/features/admin/BrandsPage')) },
        ],
      },
      {
        element: <ProtectedRoute permission="inventory:manage" />,
        children: [
          { path: '/admin/inventory', element: lazyRoute(() => import('@/features/admin/InventoryPage')) },
        ],
      },
      {
        element: <ProtectedRoute permission="orders:manage" />,
        children: [
          { path: '/admin/orders', element: lazyRoute(() => import('@/features/admin/OrdersAdminPage')) },
          { path: '/admin/customers', element: lazyRoute(() => import('@/features/admin/CustomersPage')) },
        ],
      },
      {
        element: <ProtectedRoute permission="users:manage" />,
        children: [
          { path: '/admin/users', element: lazyRoute(() => import('@/features/admin/UsersPage')) },
          { path: '/admin/reports', element: lazyRoute(() => import('@/features/admin/ReportsPage')) },
        ],
      },
    ],
  },

  // ---- System / error pages ----
  {
    element: <MinimalLayout />,
    children: [
      { path: '/403', element: lazyRoute(() => import('@/features/system/ForbiddenPage')) },
      { path: '/500', element: lazyRoute(() => import('@/features/system/ServerErrorPage')) },
      { path: '*', element: lazyRoute(() => import('@/features/system/NotFoundPage')) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
