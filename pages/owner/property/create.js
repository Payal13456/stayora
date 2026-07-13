import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../../../components/OwnerLayout';
import { getOwnerSession, isOwnerAuthenticated } from '../../../lib/ownerAuth';

const PROPERTY_STORAGE_KEY = 'stayora-owner-properties';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const getProperties = () => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(PROPERTY_STORAGE_KEY);
  return stored ? safeParse(stored, []) : [];
};

const setProperties = (properties) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(properties));
  }
  return properties;
};

export default function OwnerPropertyCreate() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [owner, setOwner] = useState(null);
  const [form, setForm] = useState({
    title: '',
    type: 'PG',
    city: '',
    address: '',
    price: '',
    genderPreference: 'Any',
    description: '',
    amenities: '',
    images: '',
    videos: '',
    ownerName: '',
    ownerPhone: '',
    user_id: ''
  });
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      router.replace('/owner/login');
      return;
    }

    const session = getOwnerSession();
    setOwner(session);
    if (session) {
      const ownerId =
        session.user_id ||
        session._id ||
        session.id ||
        session.userId ||
        session.authResponse?.user?.id ||
        session.user?._id ||
        session.user?.id ||
        session.data?.user?.id ||
        session.data?._id ||
        session.data?.id;
      setForm((prev) => ({
        ...prev,
        ownerName: session.name || session.fullName || session.username || prev.ownerName,
        ownerPhone: session.phone || session.mobile || prev.ownerPhone,
        user_id: ownerId || prev.user_id
      }));
    }
    setInitialized(true);

    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        const data = await response.json();
        if (response.ok && data?.success && Array.isArray(data.data)) {
          setCities(data.data);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setCityLoading(false);
      }
    };

    fetchCities();
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.city || !form.address || !form.price || !form.description || !form.ownerName || !form.ownerPhone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const ownerId = form.user_id || owner?._id || owner?.id || owner?.user_id || owner?.userId;
      if (!ownerId) {
        setError('Owner ID is missing. Please sign in again.');
        setLoading(false);
        return;
      }

      const propertyPayload = {
        title: form.title,
        type: form.type,
        city: form.city,
        address: form.address,
        price: Number(form.price),
        genderPreference: form.genderPreference,
        description: form.description,
        amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
        images: form.images ? form.images.split(',').map((item) => item.trim()).filter(Boolean) : [],
        videos: form.videos ? form.videos.split(',').map((item) => item.trim()).filter(Boolean) : [],
        ownerName: form.ownerName,
        ownerPhone: form.ownerPhone,
        ownerEmail: owner?.email,
        user_id: ownerId
      };

      const response = await fetch('/api/properties/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyPayload)
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        setError(result?.message || 'Failed to create listing.');
        return;
      }

      setSuccess('Property created successfully.');
      router.push('/owner/dashboard');
    } catch (err) {
      console.error('Create property error:', err);
      setError('Unable to create property. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Preparing your listing page...</p>
      </div>
    );
  }

  return (
    <OwnerLayout
      title="Create Listing"
      subtitle="Add a new property to your owner dashboard"
      active="property"
    >
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl">
            <h1 className="text-3xl font-semibold text-white">Create property listing</h1>
            <p className="mt-2 text-slate-400">Publish a new property to your owner dashboard and make it visible to students.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl">
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Property title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Sunshine Girls PG"
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="PG">PG</option>
                <option value="FLAT">Flat</option>
                <option value="HOSTEL">Hostel</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              City
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select a city</option>
                {cityLoading ? (
                  <option value="" disabled>Loading cities...</option>
                ) : (
                  cities.map((city) => (
                    <option key={city._id || city.id || city.name} value={city._id || city.id}>
                      {city.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Address
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Bhawarkua, Indore"
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Owner name
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Owner full name"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Owner phone
              <input
                name="ownerPhone"
                value={form.ownerPhone}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Owner phone number"
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Price
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="6500"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Gender preference
              <select
                name="genderPreference"
                value={form.genderPreference}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Any">Any / Co-ed</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-300">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Describe the property, rules, and highlights..."
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Amenities (comma separated)
            <input
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="WiFi, AC, Laundry"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Image URLs (comma separated)
              <input
                name="images"
                value={form.images}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="https://...jpg, https://...jpg"
              />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Video URLs (comma separated)
              <input
                name="videos"
                value={form.videos}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="https://...mp4"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="rounded-3xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white hover:bg-indigo-700 transition">
              Publish listing
            </button>
            <button
              type="button"
              onClick={() => router.push('/owner/dashboard')}
              className="rounded-3xl border border-white/10 bg-slate-900 px-6 py-4 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </OwnerLayout>
  );
}
