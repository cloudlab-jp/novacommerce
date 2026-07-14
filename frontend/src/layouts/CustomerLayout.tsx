import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useLogout } from '@/features/auth/auth.hooks';

export function CustomerLayout() {
  const user = useAuthStore((s) => s.user);
  const totalItems = useCartStore((s) => s.totalItems());
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="font-heading text-lg font-semibold text-secondary">
            NovaCommerce
          </Link>
          <Link to="/catalog" className="text-sm font-medium text-slate-600 hover:text-primary">
            Catalog
          </Link>
          <div className="flex items-center gap-5">
            <Link to="/dashboard/wishlist" className="text-slate-500 hover:text-primary">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative text-slate-500 hover:text-primary">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </span>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-slate-50">Dashboard</Link>
                  <Link to="/dashboard/orders" className="block px-4 py-2 text-sm hover:bg-slate-50">My Orders</Link>
                  <Link to="/dashboard/addresses" className="block px-4 py-2 text-sm hover:bg-slate-50">Addresses</Link>
                  <Link to="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-slate-50">Settings</Link>
                  <button
                    onClick={() => logout.mutate()}
                    className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
