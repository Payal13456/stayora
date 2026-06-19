import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home as HomeIcon, PlusCircle, MapPin, Phone } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Homivo</p>
                <p className="text-lg font-semibold text-white">Student Housing</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm">
              <Link href="/#properties" className="text-slate-300 hover:text-white transition">Browse Properties</Link>
              <Link href="/#roommates" className="text-slate-300 hover:text-white transition">Find Roommates</Link>
              <Link href="/contact-us" className="text-slate-300 hover:text-white transition">Contact Us</Link>
            </nav>

            <Link
              href="/list-property"
              className="hidden lg:inline-flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> List Property
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="absolute left-0 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">List your property</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Publish your listing with Homivo.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Reach students quickly with a polished listing page and built-in owner support for every booking.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">List faster</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Complete your home listing in minutes</h2>
                <p className="mt-4 text-slate-400">Add property details, amenities, and owner contacts so students can book with confidence.</p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Verified reach</p>
                  <p className="mt-3 text-lg font-semibold text-white">Reach verified student communities</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Tenant trust</p>
                  <p className="mt-3 text-lg font-semibold text-white">List with clear details and photos</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Fast support</p>
                  <p className="mt-3 text-lg font-semibold text-white">Receive priority owner assistance</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Performance</p>
                  <p className="mt-3 text-lg font-semibold text-white">Optimized for mobile views</p>
                </article>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
              <div className="mb-8 rounded-[2rem] bg-slate-950/90 p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <PlusCircle className="h-6 w-6 text-sky-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Get started</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Create your listing</h2>
                  </div>
                </div>
                <p className="mt-4 text-slate-400">Fill in the details below and publish a standout property listing for students to discover.</p>
              </div>

              {submissionState === 'success' ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
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
                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Property title *
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Sunshine Girls PG"
                        required
                      />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Property type *
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="PG">PG</option>
                        <option value="HOSTEL">Hostel</option>
                        <option value="FLAT">Flat</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      City *
                      <select
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
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

                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Address *
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Vijay Nagar, Indore"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Monthly rent (₹) *
                      <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="6500"
                        required
                      />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Gender preference
                      <select
                        name="genderPreference"
                        value={formData.genderPreference}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="Any">Any / Co-ed</option>
                        <option value="Male">Male Only</option>
                        <option value="Female">Female Only</option>
                      </select>
                    </label>
                  </div>

                  <label className="space-y-2 text-sm font-medium text-slate-300">
                    Description
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      placeholder="Describe the property, rules, and highlights..."
                    />
                  </label>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Image URL
                      <input
                        name="images"
                        type="url"
                        value={formData.images}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="https://example.com/image.jpg"
                      />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Video URL
                      <input
                        name="videos"
                        type="url"
                        value={formData.videos}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="https://youtube.com/..."
                      />
                    </label>
                  </div>

                  <label className="space-y-2 text-sm font-medium text-slate-300">
                    Amenities (comma separated)
                    <input
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleChange}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                      placeholder="WiFi, Food Included, AC, Laundry"
                    />
                  </label>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Owner name *
                      <input
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="Rahul Sharma"
                        required
                      />
                    </label>

                    <label className="space-y-2 text-sm font-medium text-slate-300">
                      Owner phone *
                      <input
                        name="ownerPhone"
                        type="tel"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                        placeholder="9876543210"
                        required
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submissionState === 'loading'}
                    className="w-full rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submissionState === 'loading' ? 'Publishing...' : 'Publish Listing'}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Homivo</p>
                <p className="text-xl font-semibold text-white">Student Housing</p>
              </div>
            </div>
            <p className="max-w-sm text-slate-400">A premium student accommodation marketplace built for modern renters and property owners. Search verified stays, contact trusted hosts, and move with confidence.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Explore</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/#properties" className="hover:text-white transition">Browse Properties</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Services</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li>Verified Listings</li>
              <li>Instant Booking</li>
              <li>Owner Support</li>
              <li>Student Matching</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Contact</h4>
            <div className="mt-6 space-y-4 text-slate-400">
              <p className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-indigo-400" />123 Startup Hub, Scheme 54, Indore, MP</p>
              <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-indigo-400" />+91 98765 43210</p>
              <p className="rounded-3xl bg-white/5 px-4 py-3 text-slate-300">support@homivo.com</p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Homivo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
