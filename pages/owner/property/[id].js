import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../../../components/OwnerLayout';
import { getOwnerSession, isOwnerAuthenticated } from '../../../lib/ownerAuth';

const isOwnerMatch = (owner, property) => {
  if (!property || !owner) return false;

  const ownerId =
    owner.user_id || owner._id || owner.id || owner.userId || owner.authResponse?.data?.user?.id || owner.authResponse?.user?.id;
  const propertyOwnerId =
    property.user_id || property.owner_id || property.owner?._id || property.ownerId || property.userId || property.owner;
  const normalizedOwnerEmail = String(owner.email || owner.userEmail || '').toLowerCase();
  const normalizedPropertyOwner = String(property.owner || property.ownerEmail || '').toLowerCase();

  return (
    (ownerId && propertyOwnerId && String(ownerId) === String(propertyOwnerId)) ||
    (normalizedOwnerEmail && normalizedPropertyOwner && normalizedOwnerEmail === normalizedPropertyOwner)
  );
};

export default function OwnerPropertyView() {
  const router = useRouter();
  const { id } = router.query;
  const [initialized, setInitialized] = useState(false);
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    if (!auth) {
      router.replace('/owner/login');
      return;
    }

    const session = getOwnerSession();
    setOwner(session);

    const fetchProperty = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];
        const found = items.find(
          (item) => String(item.id) === String(id) || String(item._id) === String(id)
        );

        if (!found) {
          setError('Property not found.');
          setProperty(null);
          return;
        }

        if (!isOwnerMatch(session, found)) {
          setError('You do not have permission to view this property.');
          setProperty(null);
          return;
        }

        setProperty(found);
      } catch (fetchError) {
        console.error('Owner property fetch error:', fetchError);
        setError('Unable to load property details.');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchProperty();
  }, [id, router]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <p>Loading property details...</p>
      </div>
    );
  }

  return (
    <OwnerLayout title="Property Details" subtitle="View your property listing" active="property">
      {error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-8 text-center text-slate-200">
          <p className="text-lg font-semibold text-rose-300">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/owner/property')}
            className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Back to properties
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Property overview</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">{property.title || 'Untitled Property'}</h1>
                <p className="mt-2 text-slate-400">{property.address || property.location || 'Location not available'}</p>
              </div>
              <button
                type="button"
                onClick={() => router.push('/owner/property')}
                className="inline-flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                Back to listings
              </button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-6 rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
              {property.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={property.image}
                  alt={property.title || 'Property image'}
                  className="w-full rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-20 text-center text-slate-500">
                  No property image available
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Type</p>
                  <p className="mt-2 text-lg font-semibold text-white">{property.type || 'PG'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Price</p>
                  <p className="mt-2 text-lg font-semibold text-white">₹{property.price ?? 'N/A'}</p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-6">
                <h2 className="text-lg font-semibold text-white">Description</h2>
                <p className="mt-3 text-slate-300">{property.description || 'No description provided.'}</p>
              </div>
            </div>

            <aside className="space-y-6 rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
              <div className="space-y-3 rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Owner</p>
                <p className="mt-2 text-lg font-semibold text-white">{owner?.name || property.owner || 'Your account'}</p>
                <p className="text-sm text-slate-400">{owner?.email || property.ownerEmail || ''}</p>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Gender preference</p>
                <p className="mt-2 text-lg font-semibold text-white">{property.genderPreference || property.gender || 'Any'}</p>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">City</p>
                <p className="mt-2 text-lg font-semibold text-white">{property.city?.name || property.city || 'Unknown'}</p>
              </div>
            </aside>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
