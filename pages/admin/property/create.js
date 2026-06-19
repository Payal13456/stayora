import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';

export default function AdminPropertyCreate() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cityLoading, setCityLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
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
    ownerPhone: ''
  });

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);

    if (!auth) {
      router.replace('/admin');
    }
  }, [router]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) {
          throw new Error(`City API returned ${response.status}`);
        }

        const result = await response.json();
        if (result?.success && Array.isArray(result.data)) {
          setCities(result.data);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setCityLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const response = await fetch('/api/properties/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          city: form.city,
          address: form.address,
          price: Number(form.price),
          genderPreference: form.genderPreference,
          description: form.description,
          amenities: form.amenities
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          images: form.images ? form.images.split(',').map((item) => item.trim()).filter(Boolean) : [],
          videos: form.videos ? form.videos.split(',').map((item) => item.trim()).filter(Boolean) : [],
          ownerName: form.ownerName,
          ownerPhone: form.ownerPhone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add property');
      }

      router.push('/admin/property?updated=1');
    } catch (error) {
      console.error('Error adding property:', error);
      setSubmitting(false);
    }
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
      title="Create Property"
      subtitle="Add a backend-powered listing"
      active="property"
      onSignOut={handleSignOut}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Property creation</h2>
            <p className="mt-2 text-sm text-slate-500">Create a listing in the same backend used by the frontend.</p>
          </div>
          <Link
            href="/admin/property"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to property list
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Sunshine Girls PG"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Type
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>PG</option>
                <option>FLAT</option>
                <option>HOSTEL</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Gender preference
              <select
                name="genderPreference"
                value={form.genderPreference}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option>Any</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            City
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="" disabled>{cityLoading ? 'Loading cities...' : 'Select a city'}</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>{city.name}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Address
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Bhawarkua, Indore"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Price
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="6500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Short description of the property"
            />
          </label>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Owner name
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Arjun Singh"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Owner phone
              <input
                name="ownerPhone"
                value={form.ownerPhone}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="9876543210"
              />
            </label>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Image URLs
              <textarea
                name="images"
                value={form.images}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add URLs separated by commas"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Video URLs
              <textarea
                name="videos"
                value={form.videos}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add direct video URLs separated by commas"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Amenities
            <textarea
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="WiFi, AC, Food Included"
            />
          </label>

          <button
            disabled={submitting}
            className="w-full rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Creating Property...' : 'Create Property'}
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
