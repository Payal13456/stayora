import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';
import { PROPERTIES_API_URL } from '../../../lib/apiConfig';

const normalizeProperty = (property) => ({
  id: property._id || property.id,
  title: property.title || 'Untitled property',
  type: property.type || 'PG',
  location: property.city?.name || property.address || property.location || 'Unknown location',
  price: Number(property.price || 0),
  gender: property.genderPreference || property.gender || 'Any',
  owner: property.ownerName || property.owner?.name || property.owner || 'Not specified',
  city: property.city?.name || '',
  image:
    Array.isArray(property.images) && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
});

export default function AdminPropertyList() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError('');

      const response = await fetch(`${PROPERTIES_API_URL}?_ts=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Properties API returned ${response.status}`);
      }

      const result = await response.json();
      if (!result?.success || !Array.isArray(result.data)) {
        throw new Error(result?.message || 'Unable to load properties');
      }

      setProperties(result.data.map(normalizeProperty));
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties([]);
      setApiError('Unable to load properties from the backend right now.');
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);

    if (!auth) {
      router.replace('/admin');
      return;
    }

    fetchProperties();
  }, [router, fetchProperties]);

  useEffect(() => {
    if (!router.isReady || !authenticated) return;

    if (router.query?.updated) {
      fetchProperties();
      router.replace('/admin/property', undefined, { shallow: true });
    }
  }, [router, authenticated, fetchProperties]);

  useEffect(() => {
    if (!authenticated) return;

    const handleFocus = () => {
      fetchProperties();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authenticated, fetchProperties]);

  const filteredProperties = properties.filter((property) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return [property.title, property.location, property.owner, property.type, property.gender]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const propertyStats = {
    total: properties.length,
    pg: properties.filter((property) => property.type === 'PG').length,
    flats: properties.filter((property) => property.type === 'Flat').length,
    avgPrice:
      properties.length > 0
        ? Math.round(properties.reduce((sum, property) => sum + Number(property.price || 0), 0) / properties.length)
        : 0
  };

  const handleSignOut = () => {
    signOutAdmin();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="Manage Properties"
      subtitle="Review backend listings in the Homivo admin panel"
      active="property"
      onSignOut={handleSignOut}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total listings', value: propertyStats.total },
            { label: 'PG listings', value: propertyStats.pg },
            { label: 'Flat listings', value: propertyStats.flats },
            { label: 'Avg. price', value: propertyStats.avgPrice ? `₹${propertyStats.avgPrice}` : 'N/A' }
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Properties</h2>
              <p className="mt-1 text-sm text-slate-500">Loaded directly from the backend properties API.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, location, owner, or type"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 md:w-80"
              />
              <button
                type="button"
                onClick={fetchProperties}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Refresh
              </button>
              <Link
                href="/admin/property/create"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Create property
              </Link>
            </div>
          </div>
        </div>

        {apiError ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {apiError}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {apiLoading ? (
            <div className="sm:col-span-2 xl:col-span-3 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading properties from the backend...
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{property.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{property.location}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{property.type}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{property.gender}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">₹{property.price}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">Owner: {property.owner}</p>
                    {property.city ? <p className="mt-1 text-sm text-slate-500">City: {property.city}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/property/${property.id}`}
                      className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search or create a new property listing.
              </p>
              <Link
                href="/admin/property/create"
                className="mt-6 inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Create property
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
