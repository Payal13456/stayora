import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';
import { getProperties, updateProperty, deleteProperty } from '../../../lib/adminData';

export default function AdminPropertyList() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
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
      return;
    }
    setProperties(getProperties());
  }, [router]);

  const handleEditClick = (property) => {
    setEditingId(property.id);
    setEditForm({
      ...property,
      price: String(property.price),
      imageUrls: property.images ? property.images.join(', ') : '',
      videoUrls: property.videos ? property.videos.join(', ') : ''
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const images = editForm.imageUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
    const videos = editForm.videoUrls
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    updateProperty({ ...editForm, price: Number(editForm.price), images, videos });
    setProperties(getProperties());
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this property permanently?')) {
      deleteProperty(id);
      setProperties(getProperties());
    }
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
      title="Property List"
      subtitle="Review, edit, or remove property listings"
      active="property"
      onSignOut={handleSignOut}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Properties</h2>
            <p className="mt-1 text-sm text-slate-500">Manage all properties created by the admin.</p>
          </div>
          <Link
            href="/admin/property/create"
            className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Create property
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <div key={property.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {property.images && property.images.length > 0 ? (
                <div className="h-40 overflow-hidden bg-slate-100">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-500">No image</div>
              )}
              <div className="p-5">
                {editingId === property.id ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <input
                        name="title"
                        value={editForm.title}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <input
                        name="location"
                        value={editForm.location}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                      <select
                        name="type"
                        value={editForm.type}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option>PG</option>
                        <option>Flat</option>
                        <option>Hostel</option>
                        <option>Shared Room</option>
                      </select>
                      <select
                        name="gender"
                        value={editForm.gender}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option>Any</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleChange}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <input
                      name="owner"
                      value={editForm.owner}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <label className="block text-sm font-medium text-slate-700">
                      Image URLs
                      <textarea
                        name="imageUrls"
                        value={editForm.imageUrls}
                        onChange={handleChange}
                        rows={2}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add URLs separated by commas"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Video URLs
                      <textarea
                        name="videoUrls"
                        value={editForm.videoUrls}
                        onChange={handleChange}
                        rows={2}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add direct video URLs separated by commas"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleSave}
                        className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{property.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{property.location}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{property.type}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{property.gender}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">₹{property.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">Owner: {property.owner}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/property/${property.id}`}
                        className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleEditClick(property)}
                        className="rounded-2xl border border-indigo-600 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="rounded-2xl border border-red-600 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
