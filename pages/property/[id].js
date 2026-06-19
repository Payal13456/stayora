import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../lib/adminAuth';
import { getPropertyById } from '../../lib/adminData';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);

 useEffect(() => {
  const fetchProperty = async () => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);

    if (!auth) {
      router.replace('/admin');
      return;
    }

    if (id) {
      try {
        setLoading(true);

        const listing = await getPropertyById(id);
        console.log('Fetched property for ID:', id, listing);

        setProperty(listing);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  fetchProperty();
}, [id, router]);
  const handleSignOut = () => {
    signOutAdmin();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  if (!property) {
    return (
      <AdminLayout
        title="Property Details"
        subtitle="Error viewing listing"
        active="property"
        onSignOut={handleSignOut}
      >
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-slate-900/50 p-10 shadow-lg text-center backdrop-blur-sm">
          <p className="text-slate-400">Property not found or still loading.</p>
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => router.push('/admin/property')} 
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Back to listings
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Property Details"
      subtitle={`Viewing listing ID: #${id}`}
      active="property"
      onSignOut={handleSignOut}
    >
      <div className="space-y-6">
        {/* Header Action Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Property Overview
            </span>
            <h1 className="mt-2 text-3xl font-semibold text-white tracking-wide">{property.title}</h1>
            <p className="mt-1 text-sm text-slate-400">{property.location}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push('/admin/property')}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Back to listings
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Left Media Block */}
          <div className="space-y-6">
            {/* Images Matrix */}
            <div className="grid gap-4 sm:grid-cols-2">
              {property.images && property.images.length > 0 ? (
                property.images.map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950 aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${property.title} image ${index + 1}`} className="h-full w-full object-cover hover:scale-102 transition duration-300" />
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-10 text-center text-slate-500 col-span-2">
                  No images available
                </div>
              )}
            </div>

            {/* Videos Array */}
            {property.videos && property.videos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Videos</h2>
                <div className="grid gap-4">
                  {property.videos.map((video, index) => (
                    <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
                      <video controls className="h-full w-full outline-none">
                        <source src={video} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Spec Metadata Sidebar */}
          <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm h-fit">
            <div>
              <h2 className="text-lg font-semibold text-white">Specs Summary</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div className="rounded-2xl bg-slate-950 border border-white/5 p-3.5 flex justify-between items-center">
                  <span className="font-medium text-slate-400">Listing Category:</span> 
                  <span className="text-white font-semibold">{property.type}</span>
                </div>
                <div className="rounded-2xl bg-slate-950 border border-white/5 p-3.5 flex justify-between items-center">
                  <span className="font-medium text-slate-400">Tenant Target:</span> 
                  <span className="text-white font-semibold">{property.gender || 'Any'}</span>
                </div>
                <div className="rounded-2xl bg-slate-950 border border-white/5 p-3.5 flex justify-between items-center">
                  <span className="font-medium text-slate-400">Price Rate:</span> 
                  <span className="text-emerald-400 font-bold">₹{property.price}</span>
                </div>
                <div className="rounded-2xl bg-slate-950 border border-white/5 p-3.5 flex justify-between items-center">
                  <span className="font-medium text-slate-400">Lister Account:</span> 
                  <span className="text-indigo-400 font-semibold">{property.owner}</span>
                </div>
              </div>
            </div>

            {/* Media System Note */}
            <div className="rounded-3xl bg-slate-950 border border-white/5 p-4 text-sm">
              <p className="font-semibold text-white">Admin Asset Notice</p>
              <p className="mt-2 text-slate-400 leading-relaxed text-xs">
                This property includes visual assets uploaded through the dashboard. Video rendering tracks native direct streaming URLs like MP4 container formats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}