import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  Warehouse,
  ShoppingBag,
  Users,
  BarChart3,
  UserCog,
  LogOut,
} from 'lucide-react';
import type { Permission } from '@/types/auth';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/features/auth/auth.hooks';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  permission?: Permission; // sin permission = visible para cualquier rol interno
}

// Única lista de navegación admin — el mismo `permission` que aquí filtra
// también es el que exige ProtectedRoute en routes/admin.routes.tsx.
const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package, permission: 'catalog:manage' },
  { label: 'Categories', path: '/admin/categories', icon: FolderTree, permission: 'catalog:manage' },
  { label: 'Brands', path: '/admin/brands', icon: Tags, permission: 'catalog:manage' },
  { label: 'Inventory', path: '/admin/inventory', icon: Warehouse, permission: 'inventory:manage' },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, permission: 'orders:manage' },
  { label: 'Customers', path: '/admin/customers', icon: Users, permission: 'orders:manage' },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3, permission: 'users:manage' },
  { label: 'Users & Roles', path: '/admin/users', icon: UserCog, permission: 'users:manage' },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const can = useAuthStore((s) => s.can);
  const logout = useLogout();

  const items = ADMIN_NAV.filter((item) => !item.permission || can(item.permission));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-secondary text-slate-100">
        <div className="px-5 py-6">
          <Link to="/admin" className="font-heading text-lg font-semibold text-white">
            NovaCommerce
          </Link>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white',
                  isActive && 'bg-primary text-white hover:bg-primary',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-2 px-3 text-xs text-slate-400">
            <p className="font-medium text-slate-200">{user?.name}</p>
            <p className="capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
