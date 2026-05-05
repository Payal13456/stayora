import { useState } from 'react';
import Link from 'next/link';
import { Home as HomeIcon, PlusCircle } from 'lucide-react';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'PG',
    location: '',
    price: '',
    gender: 'Any',
    amenities: '',
    image: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500">Property Listing</p>
            <h1 className="text-4xl font-semibold text-slate-900">List your property on Stayora</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <HomeIcon className="h-4 w-4" /> Home
          </Link>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="mb-8 flex items-center gap-3 rounded-3xl bg-indigo-50 p-5">
            <PlusCircle className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-sm text-indigo-700">Quick action</p>
              <p className="text-lg font-semibold text-slate-900">Fill in the property details below to publish your listing.</p>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
              <h2 className="text-2xl font-semibold mb-2">Listing submitted!</h2>
              <p className="mb-4">Your property has been prepared for publishing. A real implementation would save this to your database.</p>
              <div className="grid gap-2 text-slate-700">
                <div><strong>Title:</strong> {formData.title}</div>
                <div><strong>Type:</strong> {formData.type}</div>
                <div><strong>Location:</strong> {formData.location}</div>
                <div><strong>Price:</strong> ₹{formData.price}</div>
                <div><strong>Gender:</strong> {formData.gender}</div>
                <div><strong>Amenities:</strong> {formData.amenities}</div>
                <div><strong>Photo URL:</strong> {formData.image}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Property title
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Sunshine Girls PG"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Property type
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option>PG</option>
                    <option>Flat</option>
                    <option>Hostel</option>
                    <option>Shared Room</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Location
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Vijay Nagar, Indore"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Monthly rent
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="6500"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Preferred gender
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Photo URL
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Amenities
                <input
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="WiFi, Food Included, AC, Laundry"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Publish Listing
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
