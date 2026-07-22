import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        const result = await response.json();

        if (!response.ok || !Array.isArray(result.data)) {
          throw new Error('Unable to load city data');
        }

        setCities(
          result.data.map((city) => ({
            _id: city._id || city.id,
            name: city.name || 'Unknown City',
            slug:
              city.slug ||
              city._id ||
              city.id ||
              String(city.name || '')
                .trim()
                .toLowerCase()
                .replace(/\s+/g, '-'),
            image:
              city.image ||
              'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
            count: city.count || 'Popular',
          }))
        );
      } catch (err) {
        console.error(err);
        setError('Unable to load cities at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                <span className="text-lg font-bold">H</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Homivo</p>
                <p className="text-lg font-semibold text-white">Student Housing</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-white transition">Home</Link>
              <Link href="/city" className="text-sm font-semibold text-white transition">Cities</Link>
              <Link href="/contact-us" className="text-sm font-semibold text-slate-300 hover:text-white transition">Contact Us</Link>
            </nav>

            <Link href="/list-property" className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700">
              List Property
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Cities</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Browse all cities</h1>
            <p className="mt-4 text-lg text-slate-400">
              Explore available student stays by city. Select a city to view all properties in that area.
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-slate-300">
              Loading cities...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-rose-200">
              {error}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/city/${city.slug}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-lg transition hover:-translate-y-1 hover:shadow-indigo-500/20"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-sm text-slate-300">{city.count} Listings</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">{city.name}</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm leading-6 text-slate-400">
                      View available student homes, PGs, hostels, and flats in {city.name}.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-300 py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                  <span className="text-lg font-bold">H</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Homivo</p>
                  <p className="text-xl font-semibold text-white">Student Housing</p>
                </div>
              </div>
              <p className="max-w-sm text-slate-400">
                A premium student accommodation marketplace built for modern renters and property owners. Search verified stays, contact trusted hosts, and move with confidence.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">Quick links</h3>
              <div className="mt-6 space-y-3 text-sm">
                <Link href="/" className="block text-slate-300 hover:text-white transition">Home</Link>
                <Link href="/city" className="block text-slate-300 hover:text-white transition">Cities</Link>
                <Link href="/contact-us" className="block text-slate-300 hover:text-white transition">Contact Us</Link>
                <Link href="/list-property" className="block text-slate-300 hover:text-white transition">List Property</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
