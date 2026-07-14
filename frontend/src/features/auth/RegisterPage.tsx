import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useRegister } from './auth.hooks';
import { ApiError } from '@/lib/http-client';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const register = useRegister();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    register.mutate(form, { onSuccess: () => navigate('/dashboard', { replace: true }) });
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-secondary">Crear cuenta</h1>

        {(['name', 'email', 'password'] as const).map((field) => (
          <div key={field} className="space-y-1">
            <label className="text-sm font-medium capitalize text-slate-700">{field}</label>
            <input
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        ))}

        {register.isError && (
          <p className="text-sm text-danger">
            {register.error instanceof ApiError ? register.error.message : 'No fue posible registrar la cuenta'}
          </p>
        )}

        <button
          type="submit"
          disabled={register.isPending}
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {register.isPending ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary">
            Inicia sesión
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
