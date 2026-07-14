import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 text-center">
      <h1 className="font-heading text-5xl font-semibold text-secondary">
        NovaCommerce
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
        Cloud-native e-commerce platform — CloudLab JP reference implementation.
      </p>
      <Link
        to="/catalog"
        className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-medium text-white hover:opacity-90"
      >
        Explorar catálogo
      </Link>
    </div>
  );
}
