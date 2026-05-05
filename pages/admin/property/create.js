import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';
import { addProperty } from '../../../lib/adminData';

export default function AdminPropertyCreate() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    type: 'PG',
    location: '',
    price: '',
    gender: 'Any',
    owner: '',
    imageUrls: '',
    videoUrls: ''
  });

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);
    if (!auth) {
      router.replace('/admin');
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const imageList = form.imageUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
    const videoList = form.videoUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    addProperty({
      ...form,
      price: Number(form.price),
      images: imageList,
      videos: videoList
    });
    router.push('/admin/property');
  };

  const handleSignOut = () => {
    signOutAdmin();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="Create Property"
      subtitle="Add a new listing for a user"
      active="property"
      onSignOut={handleSignOut}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Property creation</h2>
            <p className="mt-2 text-sm text-slate-500">Create a listing on behalf of a user.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/property')}
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Back to property list
          </button>
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
                <option>Flat</option>
                <option>Hostel</option>
                <option>Shared Room</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Gender preference
              <select
                name="gender"
                value={form.gender}
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
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Bhawarkua, Indore"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Owner email
            <input
              type="email"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="arjun@example.com"
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

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Image URLs
              <textarea
                name="imageUrls"
                value={form.imageUrls}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add URLs separated by commas"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Video URLs
              <textarea
                name="videoUrls"
                value={form.videoUrls}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add direct video URLs separated by commas"
              />
            </label>
          </div>

          <button className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition">
            Create Property
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
