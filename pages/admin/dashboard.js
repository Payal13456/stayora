import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../lib/adminAuth';

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

  const fetchProperties = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError('');

      const response = await fetch('/api/properties');
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Version 2.0"
      active="dashboard"
      onSignOut={handleSignOut}
    >
      <div className="space-y-5">
        <section className="grid gap-5 lg:grid-cols-[1.7fr_minmax(300px,1fr)]">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-xl shadow-slate-950/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300">Dashboard</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Monthly Recap Report</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800">
                  Today
                </button>
                <button className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">
                  Generate Report
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {[
                { label: 'Total Listings', value: propertyStats.total, icon: '📦', color: 'from-sky-500 to-indigo-600' },
                { label: 'PG Listings', value: propertyStats.pg, icon: '🏠', color: 'from-emerald-500 to-sky-600' },
                { label: 'Flat Listings', value: propertyStats.flats, icon: '🏢', color: 'from-fuchsia-500 to-violet-600' },
                { label: 'Avg. Price', value: propertyStats.avgPrice ? `₹${propertyStats.avgPrice}` : 'N/A', icon: '💰', color: 'from-amber-500 to-orange-600' }
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-slate-900/95 p-4 shadow-lg shadow-slate-950/20">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${stat.color} text-white text-base`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="xl:max-w-[58%]">
                  <h3 className="text-base font-semibold text-white">Sales: 1 Jan, 2014 - 30 Jul, 2014</h3>
                  <p className="mt-1 text-sm text-slate-400">Monthly recap for current property activity.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Goal Completion', value: 80, accent: 'bg-sky-500' },
                    { label: 'Complete Purchase', value: 78, accent: 'bg-rose-500' },
                    { label: 'Visit Premium Page', value: 60, accent: 'bg-emerald-500' },
                    { label: 'Send Inquiries', value: 50, accent: 'bg-amber-500' }
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                        <div className={`${item.accent} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                <div className="relative h-56 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_30%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_60%,rgba(15,23,42,0.95)_100%)]" />
                  <div className="relative h-full w-full">
                    <div className="absolute bottom-4 left-5 h-32 w-4 rounded-full bg-sky-500/30" />
                    <div className="absolute bottom-8 left-16 h-36 w-4 rounded-full bg-rose-500/30" />
                    <div className="absolute bottom-6 left-28 h-28 w-4 rounded-full bg-emerald-500/30" />
                    <div className="absolute bottom-14 left-38 h-40 w-4 rounded-full bg-violet-500/30" />
                    <div className="absolute bottom-8 left-52 h-34 w-4 rounded-full bg-amber-500/30" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800" />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { value: '35,210.43', label: 'TOTAL REVENUE', change: '+17%', accent: 'text-emerald-400' },
                  { value: '10,390.90', label: 'TOTAL COST', change: '+0%', accent: 'text-slate-400' },
                  { value: '24,813.53', label: 'TOTAL PROFIT', change: '+20%', accent: 'text-emerald-400' }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-900/95 p-5">
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className={`mt-4 text-3xl font-semibold text-white ${item.accent}`}>{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            {[
              { label: 'Inventory', value: '5,200', text: '50% Increase in 30 Days', color: 'bg-amber-500' },
              { label: 'Mentions', value: '92,050', text: '20% Increase in 30 Days', color: 'bg-emerald-500' },
              { label: 'Downloads', value: '114,381', text: '70% Increase in 30 Days', color: 'bg-rose-500' }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-xl">
                <div className={`inline-flex rounded-3xl px-3 py-2 text-xs font-semibold text-white ${item.color}`}>{item.label}</div>
                <p className="mt-5 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm text-slate-400">{item.text}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.55fr_minmax(300px,1fr)]">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-xl">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Visitors Report</h2>
                <p className="mt-1 text-sm text-slate-400">Geo view of the latest admin activity.</p>
              </div>
              <button className="rounded-2xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-800">
                View Details
              </button>
            </div>

            <div className="mt-5 h-[300px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90">
              <div className="grid h-full place-items-center text-slate-500">Map placeholder</div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { value: '8,390', label: 'VISITS', badge: '30% REFERRALS' },
                { value: '2,500', label: 'ORDERS', badge: '12% INCREASE' },
                { value: '1,200', label: 'GOAL COMPLETIONS', badge: '18% DECREASE' }
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-900/95 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-xs text-slate-500">{item.badge}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/95 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Property Actions</h3>
                <span className="rounded-full bg-sky-600 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white">Active</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Quick links for creating, editing, and reviewing listing performance.</p>
              <div className="mt-6 grid gap-3">
                <Link href="/admin/property/create" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-sky-500">
                  Create Property
                </Link>
                <Link href="/admin/user" className="rounded-2xl border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 text-center transition hover:bg-slate-800">
                  Manage Users
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-950/95 p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white">System Summary</h3>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Server Load', value: '23%', status: 'Good' },
                  { label: 'Active Sessions', value: '1,243', status: 'Stable' },
                  { label: 'Open Tickets', value: '17', status: 'Review' }
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-900/95 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{item.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/95 p-5 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Latest Properties</h2>
                <p className="mt-1 text-sm text-slate-400">A quick overview of the newest listings.</p>
              </div>
              <Link
                href="/admin/property"
                className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500"
              >
                View All Properties
              </Link>
            </div>

            {apiError ? (
              <div className="mt-5 rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
                {apiError}
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apiLoading ? (
                <div className="col-span-full rounded-3xl border border-slate-700 bg-slate-950/80 p-6 text-center text-slate-400">
                  Loading properties from the backend...
                </div>
              ) : filteredProperties.length > 0 ? (
                filteredProperties.slice(0, 6).map((property) => (
                  <div key={property.id} className="rounded-3xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg shadow-slate-950/20">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{property.type}</p>
                    <h3 className="mt-2 text-base font-semibold text-white">{property.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{property.location}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
                      <span>{property.gender}</span>
                      <span>₹{property.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-6 text-center">
                  <h3 className="text-base font-semibold text-white">No properties found</h3>
                  <p className="mt-2 text-sm text-slate-400">Start by creating a new listing or refreshing the data.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
