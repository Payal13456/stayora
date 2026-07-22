import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const normalizeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export default function CityPropertiesPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [city, setCity] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchCityAndProperties = async () => {
      try {
        const cityRes = await fetch('/api/cities');
        const cityResult = await cityRes.json();

        if (!cityRes.ok || !Array.isArray(cityResult.data)) {
          throw new Error('Unable to load city data');
        }

        const foundCity = cityResult.data.find((item) => {
          const citySlug = item.slug || normalizeSlug(item.name || item._id || item.id);
          return citySlug === slug || String(item._id || item.id) === String(slug);
        });

        if (!foundCity) {
          setError('City not found.');
          setLoading(false);
          return;
        }

        setCity(foundCity);

        const response = await fetch(`/api/properties?city=${encodeURIComponent(foundCity._id || foundCity.id)}`);
        const result = await response.json();

        if (!response.ok || !Array.isArray(result.data)) {
          throw new Error('Unable to load properties for this city');
        }

        setProperties(result.data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load city properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchCityAndProperties();
  }, [slug]);

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
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">City properties</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                {city ? `Properties in ${city.name}` : 'City properties'}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-400">
                Browse all student-friendly properties available in this city.
              </p>
            </div>
            <Link
              href="/city"
              className="inline-flex items-center rounded-full bg-slate-800/90 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Back to all cities
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-slate-300">
              Loading properties...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-10 text-rose-200">
              {error}
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-10 text-slate-300">
              No properties found for {city?.name || 'this city'}.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div
                  key={property._id || property.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-lg transition hover:-translate-y-1 hover:shadow-indigo-500/20"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'}
                      alt={property.title || property.address}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm uppercase tracking-[0.2em] text-sky-300">{property.type || property.title}</p>
                    <h2 className="mt-3 text-xl font-semibold text-white">{property.title || property.address || 'Listing'}</h2>
                    <p className="mt-2 text-slate-400">{property.address || property.location || 'Location not specified'}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-white">
                      <span className="font-semibold">₹{property.price ?? 'N/A'}</span>
                      <span className="text-sm text-slate-400">{property.genderPreference || property.gender || 'Any'}</span>
                    </div>
                  </div>
                </div>
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
