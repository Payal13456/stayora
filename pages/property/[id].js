import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getPropertyById } from '../../lib/adminData';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    if (!id) return;
    const listing = getPropertyById(id);
    setProperty(listing);
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-white p-10 shadow-sm">
          <p className="text-center text-slate-700">Property not found or still loading.</p>
          <div className="mt-6 flex justify-center">
            <Link href="/list-property" className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Property details</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">{property.title}</h1>
            <p className="mt-3 text-sm text-slate-600">{property.location}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/list-property" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Back to listings
            </Link>
            <Link href="/" className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              Home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {property.images && property.images.length > 0 ? (
                property.images.map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-3xl bg-slate-100">
                    <img src={src} alt={`${property.title} image ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-slate-100 p-10 text-center text-slate-500">No images available</div>
              )}
            </div>

            {property.videos && property.videos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Videos</h2>
                <div className="grid gap-4">
                  {property.videos.map((video, index) => (
                    <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-black">
                      <video controls className="h-full w-full">
                        <source src={video} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900">Type:</span> {property.type}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Gender preference:</span> {property.gender}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Price:</span> ₹{property.price}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Owner:</span> {property.owner}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Media notes</p>
              <p className="mt-2">This property includes visual media uploaded through the admin panel. Video URLs should be direct mp4/webm sources for playback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
