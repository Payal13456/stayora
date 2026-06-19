import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../lib/adminAuth';
import { PROPERTIES_API_URL } from '../../lib/apiConfig';

const normalizeProperty = (property) => ({
  id: property._id || property.id,
  title: property.title || 'Untitled property',
  type: property.type || 'PG',
  location: property.city?.name || property.address || property.location || 'Unknown location',
  price: Number(property.price || 0),
  gender: property.genderPreference || property.gender || 'Any',
  owner: property.ownerName || property.owner?.name || property.owner || 'Not specified',
  city: property.city?.name || property.city || '',
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
  const [appliedPropertyCityId, setAppliedPropertyCityId] = useState('');

  const fetchProperties = useCallback(async () => {
     try {
       setApiLoading(true);
       setApiError('');
 
       const params = new URLSearchParams();
       if (appliedPropertyCityId.trim()) {
         params.set('city', appliedPropertyCityId.trim());
       }
 
       const response = await fetch(`/api/properties${params.toString() ? `?${params.toString()}` : ''}`);
       if (!response.ok) {
         throw new Error(`Failed to fetch properties: ${response.statusText}`);
       }
       
       const result = await response.json();
       
       if (result?.data && Array.isArray(result.data)) {
         setProperties(result.data.map(normalizeProperty));
       }
     } catch (error) {
       console.error('Failed to load properties:', error);
       setApiError(error.message || 'Failed to sync listings from backend database.');
     } finally {
       setApiLoading(false);
     }
   }, [appliedPropertyCityId]);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="Manage Properties"
      subtitle="Review backend listings in the Homivo admin panel"
      active="dashboard"
      onSignOut={handleSignOut}
    >
      <div className="flex flex-col gap-6">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total listings', value: propertyStats.total },
            { label: 'PG listings', value: propertyStats.pg },
            { label: 'Flat listings', value: propertyStats.flats },
            { label: 'Avg. price', value: propertyStats.avgPrice ? `₹${propertyStats.avgPrice}` : 'N/A' }
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Properties</h2>
              <p className="mt-1 text-sm text-slate-400">Loaded directly from the backend properties API.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, location, owner, or type"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 md:w-80"
              />
              <button
                type="button"
                onClick={fetchProperties}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
              >
                Refresh
              </button>
              <Link
                href="/admin/property/create"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
              >
                Create property
              </Link>
            </div>
          </div>
        </div>

        {apiError ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {apiError}
          </div>
        ) : null}

        {/* Property Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {apiLoading ? (
            <div className="sm:col-span-2 xl:col-span-3 rounded-3xl border border-white/10 bg-slate-900/50 p-10 text-center text-slate-400 shadow-lg">
              Loading properties from the backend...
            </div>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl transition-transform duration-200 hover:scale-[1.01]">
                <div className="h-40 overflow-hidden bg-slate-950 relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-lg font-semibold text-white tracking-wide">{property.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{property.location}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">{property.type}</span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">{property.gender}</span>
                      <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 font-semibold">₹{property.price}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1 text-sm text-slate-400">
                      <p><span className="text-slate-500">Owner:</span> {property.owner}</p>
                      {property.city ? <p><span className="text-slate-500">City:</span> {property.city}</p> : null}
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/property/${property.id}`}
                      className="block text-center rounded-2xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm:col-span-2 xl:col-span-3 rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-10 text-center">
              <h3 className="text-lg font-semibold text-white">No properties found</h3>
              <p className="mt-2 text-sm text-slate-400">
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