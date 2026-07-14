import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export function PublicLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const totalItems = useCartStore((s) => s.totalItems());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-heading text-lg font-semibold text-secondary">
            NovaCommerce
          </Link>
          <div className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link to="/catalog" className="hover:text-primary">Catalog</Link>
            <Link to="/categories" className="hover:text-primary">Categories</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-1">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-primary sm:w-56"
                />
                <button
                  type="button"
                  aria-label="Cerrar búsqueda"
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="text-slate-500 hover:text-primary"
              >
                <Search size={20} />
              </button>
            )}
            <Link to="/cart" aria-label="Cart" className="relative text-slate-500 hover:text-primary">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-slate-500 hover:text-primary">
                <User size={20} />
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} NovaCommerce · CloudLab JP
      </footer>
    </div>
  );
}
