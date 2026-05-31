import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home as HomeIcon, PlusCircle } from 'lucide-react';

const INITIAL_FORM = {
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
};

export default function ListPropertyPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [submissionState, setSubmissionState] = useState('idle');

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) throw new Error(`Failed to load cities: ${response.status}`);

        const result = await response.json();
        if (result?.success && Array.isArray(result.data)) {
          setCities(result.data);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setCityLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionState('loading');

    const payload = {
      title: formData.title,
      type: formData.type,
      city: formData.city || null,
      address: formData.address,
      price: parseInt(formData.price, 10),
      genderPreference: formData.genderPreference,
      description: formData.description,
      amenities: formData.amenities
        .split(',')
        .map((amenity) => amenity.trim())
        .filter(Boolean),
      images: formData.images ? [formData.images] : [],
      videos: formData.videos ? [formData.videos] : [],
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone
    };

    try {
      const response = await fetch('/api/properties/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add property');
      }

      setSubmissionState('success');
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error('Error submitting property:', error);
      setSubmissionState('error');
    }
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

          {submissionState === 'success' ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800">
              <h2 className="text-2xl font-semibold mb-2">Listing submitted!</h2>
              <p className="mb-4">Your property has been successfully added to the platform.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {submissionState === 'error' && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
                  There was an error submitting your property. Please try again.
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Property title *
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
                  Property type *
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="PG">PG</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="FLAT">Flat</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  City *
                  <select
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="" disabled>
                      {cityLoading ? 'Loading cities...' : 'Select a city'}
                    </option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Address *
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Vijay Nagar, Indore"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Monthly rent (₹) *
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

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Gender preference
                  <select
                    name="genderPreference"
                    value={formData.genderPreference}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Any">Any / Co-ed</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe the property, rules, and highlights..."
                />
              </label>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Image URL
                  <input
                    name="images"
                    type="url"
                    value={formData.images}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Video URL
                  <input
                    name="videos"
                    type="url"
                    value={formData.videos}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://youtube.com/..."
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Amenities (comma separated)
                <input
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="WiFi, Food Included, AC, Laundry"
                />
              </label>

              <div className="grid gap-6 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Owner name *
                  <input
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Rahul Sharma"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Owner phone *
                  <input
                    name="ownerPhone"
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="9876543210"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submissionState === 'loading'}
                className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-indigo-400"
              >
                {submissionState === 'loading' ? 'Publishing...' : 'Publish Listing'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
