import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { useAuthStore } from '@/stores/auth.store';

const salesByCategory = [
  { category: 'Electronics', sales: 4200 },
  { category: 'Apparel', sales: 3100 },
  { category: 'Home', sales: 2400 },
  { category: 'Sports', sales: 1800 },
];

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-secondary">
        Dashboard — {user?.role.replace('_', ' ')}
      </h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <p className="mb-4 text-sm font-medium text-slate-700">Ventas por categoría</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
