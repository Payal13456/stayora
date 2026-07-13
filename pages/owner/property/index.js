import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../../../components/OwnerLayout';
import { getOwnerSession, getOwnerToken, isOwnerAuthenticated } from '../../../lib/ownerAuth';

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

export default function OwnerPropertyList() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [owner, setOwner] = useState(null);
  const [properties, setLocalProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'PG',
    city: '',
    address: '',
    price: '',
    genderPreference: 'Any',
    description: ''
  });

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      router.replace('/owner/login');
      return;
    }

    const session = getOwnerSession();
    setOwner(session);

    const ownerId =
      session?.user_id ||
      session?._id ||
      session?.id ||
      session?.authResponse?.user?.id ||
      session?.authResponse?.data?.user?.id;

    if (!ownerId) {
      setLocalProperties(getProperties());
      setInitialized(true);
      return;
    }

    fetch(`/api/properties?user_id=${encodeURIComponent(ownerId)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setLocalProperties(setProperties(data.data));
        } else {
          setLocalProperties(getProperties());
        }
      })
      .catch(() => {
        setLocalProperties(getProperties());
      })
      .finally(() => {
        setInitialized(true);
      });
  }, [router]);

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title || '',
      type: property.type || 'PG',
      city: property.city || property.location || '',
      address: property.address || '',
      price: property.price || '',
      genderPreference: property.genderPreference || property.gender || 'Any',
      description: property.description || ''
    });
    window.document.getElementById('manage-property')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
    setEditForm({
      title: '',
      type: 'PG',
      city: '',
      address: '',
      price: '',
      genderPreference: 'Any',
      description: ''
    });
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editingProperty) return;

    const updatedProperty = {
      ...editingProperty,
      title: editForm.title,
      type: editForm.type,
      city: editForm.city,
      address: editForm.address,
      price: editForm.price,
      genderPreference: editForm.genderPreference,
      description: editForm.description
    };

    const updatedProperties = properties.map((property) => {
      const propertyId = property.id || property._id || property.requestId || property.scheduleId;
      const editingId = editingProperty.id || editingProperty._id || editingProperty.requestId || editingProperty.scheduleId;
      return String(propertyId) === String(editingId) ? updatedProperty : property;
    });

    setLocalProperties(setProperties(updatedProperties));
    handleCancelEdit();
  };

  const handleDeleteProperty = (property) => {
    const propertyId = property.id || property._id || property.requestId || property.scheduleId;
    if (!window.confirm('Delete this property from your dashboard?')) {
      return;
    }

    const updatedProperties = properties.filter((current) => {
      const currentId = current.id || current._id || current.requestId || current.scheduleId;
      return String(currentId) !== String(propertyId);
    });

    setLocalProperties(setProperties(updatedProperties));
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading property manager...</p>
      </div>
    );
  }

  return (
    <OwnerLayout
      title="Manage Property"
      subtitle="List, edit, and delete your property listings"
      active="property"
    >
      <section id="manage-property" className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Manage Property</h2>
            <p className="mt-1 text-sm text-slate-400">Add new listings or keep your existing properties up to date.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/owner/property/create')}
            className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Add listing
          </button>
        </div>

        {editingProperty ? (
          <form onSubmit={handleSaveEdit} className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/90 p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block text-sm font-medium text-slate-300">
                Property title
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Type
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="PG">PG</option>
                  <option value="FLAT">Flat</option>
                  <option value="HOSTEL">Hostel</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-300">
                City
                <input
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Address
                <input
                  name="address"
                  value={editForm.address}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Price
                <input
                  name="price"
                  type="number"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-300">
                Gender preference
                <select
                  name="genderPreference"
                  value={editForm.genderPreference}
                  onChange={handleEditChange}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-300">
              Description
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows={3}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Cancel edit
              </button>
            </div>
          </form>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80">
          <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.2em] text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/80">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No listings yet. Add a property to manage them from here.
                  </td>
                </tr>
              ) : (
                properties.map((property) => {
                  const propertyId = property.id || property._id || property.requestId || property.scheduleId;
                  return (
                    <tr key={String(propertyId)} className="hover:bg-slate-900">
                      <td className="px-4 py-4 font-semibold text-white">{property.title || 'Untitled'}</td>
                      <td className="px-4 py-4">{property.address || property.city || property.location || 'Unknown'}</td>
                      <td className="px-4 py-4">{property.type || 'PG'}</td>
                      <td className="px-4 py-4">₹{property.price ?? 'N/A'}</td>
                      <td className="px-4 py-4">{property.genderPreference || property.gender || 'Any'}</td>
                      <td className="px-4 py-4 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(property)}
                          className="rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProperty(property)}
                          className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition"
                        >
                          Delete
                        </button>
                        {propertyId ? (
                          <button
                            type="button"
                            onClick={() => router.push(`/owner/property/${propertyId}`)}
                            className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                          >
                            View
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </OwnerLayout>
  );
}
