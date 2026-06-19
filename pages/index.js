import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Users, 
  Home as HomeIcon, 
  PlusCircle, 
  Building, 
  Bed, 
  IndianRupee, 
  CheckCircle2,
  Menu,
  X,
  Phone,
  User,
  ArrowLeft,
  Calendar,
  Clock,
  MessageCircle
} from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};

const AvatarFallback = ({ name, src }) => {
  const [hasError, setHasError] = useState(!src);
  const initials = getInitials(name);

  if (hasError) {
    return (
      <div className="w-16 h-16 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-lg font-bold border-2 border-indigo-500/50">
        {initials || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
    />
  );
};

const PropertyImageFallback = ({ src, title }) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <HomeIcon className="w-12 h-12 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
};

// --- MOCK DATA ---
const INITIAL_PROPERTIES = [
  {
    id: 1,
    type: 'PG',
    title: 'Sunshine Girls PG',
    location: 'Vijay Nagar, Indore',
    price: 6500,
    gender: 'Female',
    amenities: ['WiFi', 'Food Included', 'AC', 'Laundry'],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    type: 'Flat',
    title: 'Spacious 2BHK Near Campus',
    location: 'Bhawarkua, Indore',
    price: 12000,
    gender: 'Any',
    amenities: ['Semi-furnished', 'Parking', 'Security'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    type: 'Hostel',
    title: 'Elite Boys Hostel',
    location: 'Palasia, Indore',
    price: 5500,
    gender: 'Male',
    amenities: ['Meals', 'Gym', 'Study Room'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    type: 'PG',
    title: 'Comfort Stay Co-ed PG',
    location: 'Koregaon Park, Pune',
    price: 8000,
    gender: 'Any',
    amenities: ['AC', 'WiFi', 'Cleaning', 'TV'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
  }
];

const TOP_CITIES = [
  { name: 'Indore', count: '150+', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Bhopal', count: '90+', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gwalior', count: '60+', image: 'https://images.unsplash.com/photo-1600021676839-b97c413e2d67?auto=format&fit=crop&q=80&w=800' },
  { name: 'Jabalpur', count: '45+', image: 'https://images.unsplash.com/photo-1598284698544-2454685025f1?auto=format&fit=crop&q=80&w=800' }
];

const INITIAL_ROOMMATES = [
  {
    id: 1,
    name: 'Rahul Sharma',
    age: 21,
    role: 'Student - Engineering',
    budget: 5000,
    location: 'Indore',
    preferences: ['Non-smoker', 'Vegetarian', 'Night Owl'],
    bio: 'Looking for a chill roommate to share a 2BHK near Bhawarkua. I study late at night and keep things clean.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    phone: '9876543210'
  },
  {
    id: 2,
    name: 'Priya Patel',
    age: 22,
    role: 'Student - Medical',
    budget: 7000,
    location: 'Pune',
    preferences: ['Early Bird', 'Clean freak', 'No pets'],
    bio: 'Medical student looking for a peaceful environment. I prefer a female roommate who values quiet study time.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    phone: '9876543211'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    age: 24,
    role: 'Working Professional',
    budget: 8000,
    location: 'Indore',
    preferences: ['Any', 'Foodie'],
    bio: 'Just moved to the city for a new job. Looking for a flatmate to hunt for a 2BHK together.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '9876543212'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topCities, setTopCities] = useState(TOP_CITIES);
  const [cities, setCities] = useState([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [roommateLoading, setRoommateLoading] = useState(true);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertySearchCityId, setPropertySearchCityId] = useState('');
  const [appliedPropertyCityId, setAppliedPropertyCityId] = useState('');
  
  // Hoisted states to fix React Rules of Hooks violation
  const [propertyFilter, setPropertyFilter] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState(null); 
  
  // Schedule Visit States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitScheduled, setVisitScheduled] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        const result = await response.json();
        
        if (result?.data && Array.isArray(result.data)) {
          setCities(result.data.map((city) => ({
            id: city._id,
            name: city.name,
            image: city.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'
          })));
          setTopCities(result.data.map((city) => ({
            name: city.name,
            image: city.image || 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
            count: city.count || 'Popular'
          })));
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setCityLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const response = await fetch('/api/roommate');
        const result = await response.json();
        
        if (result?.data && Array.isArray(result.data)) {
          setRoommates(result.data.map((user) => ({
            id: user._id,
            name: user.name,
            age: user.age,
            role: `${user.occupationType || 'Student'}${user.occupation ? ` - ${user.occupation}` : ''}`,
            budget: user.budget,
            location: user.city || 'Any location',
            preferences: Array.isArray(user.tags) ? user.tags : [],
            avatar: user.profileImage || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
            bio: user.bio || '',
            phone: user.phone || user.whatsapp || '',
          })));
        }
      } catch (error) {
        console.error('Failed to load roommates:', error);
      } finally {
        setRoommateLoading(false);
      }
    };

    fetchRoommates();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertyLoading(true);

        const params = new URLSearchParams();
        if (appliedPropertyCityId.trim()) {
          params.set('city', appliedPropertyCityId.trim());
        }

        const response = await fetch(`/api/properties${params.toString() ? `?${params.toString()}` : ''}`);
        const result = await response.json();
        
        if (result?.data && Array.isArray(result.data)) {
          setProperties(result.data.map((prop) => ({
            id: prop._id,
            type: prop.type || 'PG',
            title: prop.title,
            location: prop.address || 'Unknown location',
            price: prop.price,
            gender: prop.genderPreference || 'Any',
            amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
            image: Array.isArray(prop.images) && prop.images.length > 0 
              ? prop.images[0] 
              : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'
          })));
        }
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setPropertyLoading(false);
      }
    };

    fetchProperties();
  }, [appliedPropertyCityId]);

  const [formData, setFormData] = useState({
    title: '', type: 'PG', address: '', price: '', genderPreference: 'Any', description: '', amenities: '', images: '', videos: '', ownerName: '', ownerPhone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // --- NAVIGATION ---
  const navigate = (tab, options = {}) => {
    const { clearFilters = true } = options;
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (clearFilters) {
      setPropertySearchCityId('');
      setAppliedPropertyCityId('');
      setPropertyFilter('All');
    }
    window.scrollTo(0, 0);
  };

  const handlePropertySearch = () => {
    setAppliedPropertyCityId(propertySearchCityId.trim());
    setPropertySearchCityId('');
    navigate('properties', { clearFilters: false });
  };

  const handleCityCardClick = (cityName) => {
    const selectedCity = cities.find((item) => item.name === cityName);
    setAppliedPropertyCityId(selectedCity?.id || '');
    setPropertySearchCityId('');
    navigate('properties', { clearFilters: false });
  };

  const handlePropertyCategoryClick = (filter) => {
    setPropertySearchCityId('');
    setAppliedPropertyCityId('');
    setPropertyFilter(filter);
    navigate('properties', { clearFilters: false });
  };

  const handleViewDetails = (property) => {
    const resolvedProperty = typeof property === 'object'
      ? property
      : properties.find((item) => String(item.id) === String(property) || String(item._id) === String(property)) || null;

    setSelectedProperty(resolvedProperty);
    setPropertyLoading(false);
    // Reset schedule states when viewing a new property
    setVisitScheduled(false);
    setVisitDate('');
    setVisitTime('');
    setShowScheduleModal(false);
    navigate('property-details');
  };

  const handleScheduleConfirm = () => {
    if (visitDate && visitTime) {
      setVisitScheduled(true);
      setShowScheduleModal(false);
    }
  };

  // --- VIEWS ---
  const renderHome = () => {
    const recentProperties = properties.slice(0, 3);
    const recentRoommates = roommates.slice(0, 3);
    const heroImages = [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1200',
    ];

    return (
      <div className="space-y-20 pb-20">
        {/* HERO BANNER WITH SEARCH */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImages[0]}
              alt="Homivo hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/75 to-slate-950/90" />
            <div className="absolute right-0 top-0 h-72 w-72 -translate-x-1/4 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="mb-12 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Find your perfect stay</p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find Amazing Homes for Student Living
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                Discover verified PGs, hostels, flats, and find compatible roommates across top student cities. Homivo makes your search faster and more reliable.
              </p>
            </div>

            {/* SEARCH BOX */}
            <div className="max-w-4xl mx-auto">
              <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 shadow-2xl backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-300 mb-4">Quick search</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Location</span>
                    <select
                      value={propertySearchCityId}
                      onChange={(e) => setPropertySearchCityId(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                      disabled={cityLoading}
                    >
                      <option value="" className="bg-slate-950 text-slate-100">{cityLoading ? 'Loading...' : 'Select location'}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id} className="bg-slate-950 text-slate-100">{city.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Type</span>
                    <select
                      value={propertyFilter}
                      onChange={(e) => handlePropertyCategoryClick(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
                    >
                      <option value="All" className="bg-slate-950 text-slate-100">All stays</option>
                      <option value="PG" className="bg-slate-950 text-slate-100">PGs</option>
                      <option value="HOSTEL" className="bg-slate-950 text-slate-100">Hostels</option>
                      <option value="FLAT" className="bg-slate-950 text-slate-100">Flats</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-200">Price Range</span>
                    <select className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/80 px-4 py-3 text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition">
                      <option className="bg-slate-950 text-slate-100">Up to ₹8,000</option>
                      <option className="bg-slate-950 text-slate-100">₹8,000 - ₹12,000</option>
                      <option className="bg-slate-950 text-slate-100">₹12,000+</option>
                    </select>
                  </label>

                  <button
                    onClick={handlePropertySearch}
                    className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-6 py-3 text-white font-semibold shadow-lg shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-sky-600 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transform"
                  >
                    <Search className="w-4 h-4 inline mr-2" /> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'Verified Stays', subtitle: 'Trusted listings reviewed by our team.', icon: CheckCircle2 },
              { title: 'Fast Booking', subtitle: 'Reserve rooms and flats in moments.', icon: Clock },
              { title: 'Trusted Support', subtitle: 'Help whenever you need it.', icon: Phone }
            ].map((card, idx) => (
              <div key={card.title} className={`rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur card-hover animate-scale-in stagger-${idx + 1}`}>
                <card.icon className="h-8 w-8 text-sky-400 animate-float" />
                <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{card.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CITIES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Explore</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Top Student Cities</h2>
            </div>
            <button onClick={() => navigate('properties')} className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95">
              Browse All
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topCities.map((city, idx) => (
              <div key={city.name} onClick={() => handleCityCardClick(city.name)} className={`group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer card-hover animate-scale-in stagger-${(idx % 6) + 1}`}>
                <img src={city.image} alt={city.name} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm text-slate-300">{city.count} Listings</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{city.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* FEATURED PGs */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Featured</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Top PGs for Students</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProperties.filter(p => p.type === 'PG').slice(0, 3).length === 0 ? (
                <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                  No property found.
                </div>
              ) : (
                recentProperties.filter(p => p.type === 'PG').slice(0, 3).map((property, idx) => (
                  <div key={property.id} onClick={() => handleViewDetails(property)} className={`bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/30 transition cursor-pointer group card-hover animate-scale-in stagger-${idx + 1}`}>
                    <div className="relative h-48 overflow-hidden">
                      <PropertyImageFallback src={property.image} title={property.title} />
                      <div className="absolute top-4 left-4 bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                      <p className="text-slate-400 text-sm flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-1" /> {property.location}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-2xl font-bold text-white flex items-center">
                          <IndianRupee className="w-5 h-5" />{property.price}
                        </span>
                        <span className="text-xs text-slate-400">/month</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FEATURED HOSTELS */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Featured</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Top Hostels for Students</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProperties.filter(p => p.type === 'Hostel').slice(0, 3).length === 0 ? (
                <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                  No property found.
                </div>
              ) : (
                recentProperties.filter(p => p.type === 'Hostel').slice(0, 3).map((property, idx) => (
                  <div key={property.id} onClick={() => handleViewDetails(property)} className={`bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/30 transition cursor-pointer group card-hover animate-scale-in stagger-${idx + 1}`}>
                    <div className="relative h-48 overflow-hidden">
                      <PropertyImageFallback src={property.image} title={property.title} />
                      <div className="absolute top-4 left-4 bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                      <p className="text-slate-400 text-sm flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-1" /> {property.location}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-2xl font-bold text-white flex items-center">
                          <IndianRupee className="w-5 h-5" />{property.price}
                        </span>
                        <span className="text-xs text-slate-400">/month</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>

            {/* FULL-WIDTH ENQUIRY BANNER (below hostels) */}
            <div className="w-full py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-slate-800 to-slate-700 p-6 flex items-center gap-6">
                  <div className="flex-1 text-white">
                    <h3 className="text-xl font-bold">Have a question? Enquire now</h3>
                    <p className="mt-1 text-sm text-slate-300">Need help with listings, pricing, or features? Our team is here to help you quickly.</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-3">
                    <a href="mailto:support@homivo.com?subject=General%20Enquiry" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 transition">
                      Enquire
                    </a>
                    <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-200 font-semibold hover:bg-white/10 transition">
                      Contact Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURED ROOMMATES */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Find Your Match</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Featured Roommates</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roommates.slice(0, 3).length === 0 ? (
                <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                  No roommate found.
                </div>
              ) : (
                roommates.slice(0, 3).map((roommate, idx) => (
                  <div key={roommate.id} className={`bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-sky-500/50 shadow-lg hover:shadow-sky-500/30 transition cursor-pointer group p-6 card-hover animate-bounce-in stagger-${idx + 1}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <AvatarFallback name={roommate.name} src={roommate.avatar} />
                      <div>
                        <h3 className="text-lg font-bold text-white">{roommate.name}</h3>
                        <p className="text-sm text-sky-300">{roommate.age} • {roommate.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{roommate.bio}</p>
                    <div className="mb-4 space-y-2">
                      <p className="text-sm text-slate-300 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-slate-500" /> {roommate.location}
                      </p>
                      <p className="text-sm text-slate-300 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-2 text-slate-500" /> {roommate.budget}/month
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {roommate.preferences.slice(0, 2).map((pref, idx) => (
                        <span key={idx} className="bg-sky-500/20 text-sky-300 text-xs px-2 py-1 rounded-md">
                          {pref}
                        </span>
                      ))}
                    </div>
                    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition hover:shadow-lg hover:shadow-sky-500/30 hover:scale-105 active:scale-95">
                      <Phone className="w-4 h-4 inline mr-2" /> Contact
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT PROPERTIES */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Latest Listings</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Recently Added Properties</h2>
              </div>
              <button onClick={() => navigate('properties')} className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProperties.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
                  No property found.
                </div>
              ) : (
                recentProperties.map((property, idx) => (
                  <div key={property.id} onClick={() => handleViewDetails(property)} className={`bg-slate-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-sky-500/50 shadow-lg hover:shadow-sky-500/30 transition cursor-pointer group card-hover animate-scale-in stagger-${idx + 1}`}>
                    <div className="relative h-48 overflow-hidden">
                      <PropertyImageFallback src={property.image} title={property.title} />
                      <div className="absolute top-4 left-4 bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {property.type}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                      <p className="text-slate-400 text-sm flex items-center mt-2">
                        <MapPin className="w-4 h-4 mr-1" /> {property.location}
                      </p>
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-2xl font-bold text-white flex items-center">
                          <IndianRupee className="w-5 h-5" />{property.price}
                        </span>
                        <span className="text-xs text-slate-400">/month</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderProperties = () => {
    const filteredProperties = propertyFilter === 'All' 
      ? properties 
      : properties.filter(p => p.type === propertyFilter);
    const selectedCityName = cities.find((city) => city.id === appliedPropertyCityId)?.name || '';

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Properties</h1>
            <p className="text-slate-300 mt-2">Find the perfect place that fits your budget and lifestyle.</p>
            {selectedCityName ? (
              <div className="mt-4 inline-flex items-center rounded-full bg-indigo-600/20 border border-indigo-500/50 px-4 py-2 text-sm font-semibold text-indigo-300">
                Filtered by: {selectedCityName}
              </div>
            ) : null}
          </div>
          
          {/* Filters */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-max">
            {['All', 'PG', 'HOSTEL', 'FLAT'].map(f => (
              <button
                key={f}
                onClick={() => setPropertyFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  propertyFilter === f ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyLoading ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 shadow-sm">
              Loading properties...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 shadow-sm">
              No properties found.
            </div>
          ) : filteredProperties.map(property => (
            <div key={property.id} onClick={() => handleViewDetails(property)} className="bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-white/10 hover:border-sky-500/50 hover:shadow-sky-500/20 transition flex flex-col group cursor-pointer">
              <div className="relative h-56 overflow-hidden group">
                <PropertyImageFallback src={property.image} title={property.title} />
                <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                  {property.type}
                </div>
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white flex items-center shadow-sm">
                  <User className="w-3 h-3 mr-1" /> {property.gender}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{property.title}</h3>
                </div>
                <p className="text-slate-400 text-sm flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-slate-500" /> {property.location}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-white/10 text-slate-300 text-xs px-2 py-1 rounded-md">
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white flex items-center">
                      <IndianRupee className="w-5 h-5" />{property.price}
                    </span>
                    <span className="text-slate-400 text-xs">/ month</span>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(property)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    );
  };

  const renderPropertyDetails = () => {
    if (!selectedProperty) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-lg font-semibold text-white">
              {propertyLoading ? 'Loading property details...' : 'Property details are unavailable.'}
            </p>
            <p className="mt-2 text-slate-300">
              {propertyLoading ? 'Please wait while we load the listing.' : 'Go back to the property list and try another listing.'}
            </p>
            <button
              onClick={() => navigate('properties')}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Properties
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Schedule Visit Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Schedule a Visit</h2>
                <button 
                  onClick={() => setShowScheduleModal(false)} 
                  className="text-slate-400 hover:bg-white/10 p-2 rounded-full transition"
                >
                  <X className="w-5 h-5"/>
                </button>
              </div>
              
              <div className="space-y-5 mb-8">
                <div>
                  <label className="text-sm font-semibold text-slate-200 mb-1.5 block">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="date" 
                      value={visitDate} 
                      onChange={(e) => setVisitDate(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-200 mb-1.5 block">Select Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="time" 
                      value={visitTime} 
                      onChange={(e) => setVisitTime(e.target.value)} 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition" 
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleScheduleConfirm}
                disabled={!visitDate || !visitTime}
                className="w-full bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex justify-center items-center"
              >
                Confirm Visit
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => navigate('properties')}
          className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
        </button>

        <div className="bg-slate-900/50 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          {/* Hero Image */}
          <div className="h-64 md:h-96 w-full relative">
            <img 
              src={(selectedProperty.images && selectedProperty.images[0]) || selectedProperty.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'} 
              alt={selectedProperty.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm">
              {selectedProperty.type}
            </div>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedProperty.title}</h1>
                {(() => {
                  const derivedLocation = selectedProperty.city?.name || selectedProperty.address || selectedProperty.location || 'Unknown location';
                  return (
                    <p className="text-lg text-slate-300 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-slate-500" /> {derivedLocation}
                    </p>
                  );
                })()}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-indigo-600/20 border border-indigo-500/50 px-4 py-3 rounded-xl flex items-center">
                  <User className="w-5 h-5 text-indigo-300 mr-2" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Preferred Gender</p>
                    <p className="font-bold text-white">{selectedProperty.genderPreference || selectedProperty.gender || 'Any'}</p>
                  </div>
                </div>
                <div className="bg-indigo-600/20 border border-indigo-500/50 px-4 py-3 rounded-xl flex items-center">
                  <Building className="w-5 h-5 text-indigo-300 mr-2" />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Property Type</p>
                    <p className="font-bold text-white">{selectedProperty.type}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {(selectedProperty.amenities || []).map((amenity, idx) => (
                      <span key={idx} className="bg-white/10 border border-white/20 text-slate-200 px-4 py-2 rounded-lg font-medium">
                        {amenity}
                      </span>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">About this property</h3>
                <p className="text-slate-300 leading-relaxed">
                  {(() => {
                    const derivedLocation = selectedProperty.city?.name || selectedProperty.address || selectedProperty.location || '';
                    const typeLower = (selectedProperty.type || 'property').toLowerCase();
                    return `This beautiful ${typeLower} located in the heart of ${derivedLocation} offers a comfortable and secure living environment. Perfectly suited for students and young professionals, it comes equipped with essential amenities to make your stay hassle-free. The neighborhood is vibrant and offers easy access to local markets and transportation. Contact the owner for more details or to schedule a visit!`;
                  })()}
                </p>
              </div>
            </div>

            {/* Sidebar / Pricing Card */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl sticky top-24">
                <div className="mb-6">
                  <span className="text-slate-400 text-sm font-medium">Monthly Rent</span>
                  <div className="flex items-end mt-1">
                    <span className="text-4xl font-extrabold text-white flex items-center">
                      <IndianRupee className="w-8 h-8" />{selectedProperty.price}
                    </span>
                    <span className="text-slate-400 ml-1 mb-1">/ month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex justify-center items-center shadow-lg shadow-indigo-500/20">
                    <Phone className="w-5 h-5 mr-2" /> Contact Owner
                  </button>
                  
                  {visitScheduled ? (
                    <div className="w-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/50 font-bold py-4 rounded-xl flex justify-center items-center animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Visit Scheduled
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowScheduleModal(true)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-4 rounded-xl transition flex justify-center items-center"
                    >
                      <Calendar className="w-5 h-5 mr-2" /> Schedule a Visit
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-center text-slate-400 mt-4">
                  No brokerage fees applied through Homivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoommates = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Find a Roommate</h1>
        <p className="text-slate-300 mt-2">Connect with students looking for shared accommodation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roommateLoading ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 shadow-sm">
            Loading roommates...
          </div>
        ) : roommates.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300 shadow-sm">
            No roommates found at the moment.
          </div>
        ) : roommates.map(person => (
          <div key={person.id} className="bg-slate-900/50 rounded-2xl p-6 shadow-sm border border-white/10 hover:border-sky-500/50 hover:shadow-sky-500/20 transition">
            <div className="flex items-center space-x-4 mb-4">
              <AvatarFallback name={person.name} src={person.avatar} />
              <div>
                <h3 className="text-lg font-bold text-white">{person.name}, {person.age}</h3>
                <p className="text-sm text-indigo-300 font-medium">{person.role}</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm mb-4 line-clamp-3">"{person.bio}"</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-slate-300">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" /> 
                Location: <span className="font-medium text-white ml-1">{person.location}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <IndianRupee className="w-4 h-4 mr-2 text-slate-400" /> 
                Budget: <span className="font-medium text-white ml-1">₹{person.budget}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {person.preferences.map((pref, idx) => (
                <span key={idx} className="bg-indigo-600/20 text-indigo-300 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-500/30">
                  {pref}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a 
                href={`tel:${person.phone}`}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-sm font-semibold transition border border-white/10"
              >
                <Phone className="w-4 h-4 mr-2" /> Call
              </a>
              <a 
                href={`https://wa.me/91${person.phone}?text=${encodeURIComponent(`Hi ${person.name}, I saw your profile on Homivo and would love to connect about finding a place together!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-[#25D366] hover:bg-[#1ebd5b] text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Chat
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProperty = () => {
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        setSubmitted('loading');
        
        const payload = {
          title: formData.title,
          type: formData.type,
          address: formData.address,
          price: parseInt(formData.price),
          genderPreference: formData.genderPreference,
          description: formData.description,
          amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
          images: formData.images ? [formData.images] : [],
          videos: formData.videos ? [formData.videos] : [],
          ownerName: formData.ownerName,
          ownerPhone: formData.ownerPhone,
          city: formData.city || null
        };

        const response = await fetch('/api/properties/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Failed to add property');
        }

        const result = await response.json();
        setSubmitted('success');
        
        setTimeout(() => {
          navigate('properties');
          setSubmitted(false);
          setFormData({ title: '', type: 'PG', city: '', address: '', price: '', genderPreference: 'Any', description: '', amenities: '', images: '', videos: '', ownerName: '', ownerPhone: '' });
        }, 2000);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitted('error');
        setTimeout(() => setSubmitted(false), 3000);
      }
    };

    if (submitted === 'loading') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600">Adding your property...</p>
        </div>
      );
    }

    if (submitted === 'error') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <X className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500">Failed to add property. Please try again.</p>
        </div>
      );
    }

    if (submitted === 'success') {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Listed!</h2>
          <p className="text-gray-500">Your property has been successfully added to our platform. Redirecting to listings...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-10">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">List Your Property</h1>
            <p className="text-gray-500 mt-2">Fill in the details below to reach thousands of students.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Property Title *</label>
                <input 
                  required name="title" onChange={handleChange} value={formData.title}
                  type="text" placeholder="e.g. Sunshine Girls PG" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Property Type *</label>
                <select 
                  name="type" onChange={handleChange} value={formData.type}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                >
                  <option value="PG">PG</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">City *</label>
                <select
                  required
                  name="city"
                  onChange={handleChange}
                  value={formData.city}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                >
                  <option value="" disabled>{cityLoading ? 'Loading cities...' : 'Select a city'}</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Address *</label>
                <input 
                  required name="address" onChange={handleChange} value={formData.address}
                  type="text" placeholder="e.g. Vijay Nagar, Indore" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Monthly Rent (₹) *</label>
                <input 
                  required name="price" onChange={handleChange} value={formData.price}
                  type="number" placeholder="6500" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Gender Preference</label>
                <select 
                  name="genderPreference" onChange={handleChange} value={formData.genderPreference}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                >
                  <option value="Any">Any / Co-ed</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea 
                name="description" onChange={handleChange} value={formData.description}
                rows="3" placeholder="Describe your property, rules, and what makes it special..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                <input 
                  name="images" onChange={handleChange} value={formData.images}
                  type="url" placeholder="https://example.com/image.jpg" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Video URL (Optional)</label>
                <input 
                  name="videos" onChange={handleChange} value={formData.videos}
                  type="url" placeholder="https://instagram.com/reels/..." 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Amenities (Comma separated)</label>
              <textarea 
                name="amenities" onChange={handleChange} value={formData.amenities}
                rows="2" placeholder="WiFi, Food Included, AC, Laundry, Gym..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* Owner Details */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Your Name *</label>
                  <input 
                    required name="ownerName" onChange={handleChange} value={formData.ownerName}
                    type="text" placeholder="Rahul Sharma" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                  <input 
                    required name="ownerPhone" onChange={handleChange} value={formData.ownerPhone}
                    type="tel" placeholder="9876543210" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-md flex justify-center items-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Publish Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- LAYOUT ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Homivo</p>
                <p className="text-lg font-semibold text-white">Student Housing</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {[
                { id: 'home', label: 'Home' },
                { id: 'properties', label: 'Browse Properties' },
                { id: 'roommates', label: 'Find Roommates' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-sm font-semibold transition ${
                    activeTab === item.id || (activeTab === 'property-details' && item.id === 'properties') ? 'text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link href="/contact-us" className="text-sm font-semibold text-slate-300 hover:text-white transition">
                Contact Us
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/list-property"
                className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                List Property
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-full border border-white/10 p-3 text-slate-300 shadow-sm hover:border-white/20 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-b border-white/10 shadow-lg absolute w-full left-0 z-40">
            <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col">
              {[
                { id: 'home', label: 'Home' },
                { id: 'properties', label: 'Browse Properties' },
                { id: 'roommates', label: 'Find Roommates' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-left w-full rounded-2xl px-4 py-3 text-base font-semibold transition ${
                    activeTab === item.id || (activeTab === 'property-details' && item.id === 'properties') ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/contact-us"
                className="text-left block w-full rounded-2xl px-4 py-3 text-base font-semibold text-slate-300 hover:bg-white/10 transition"
              >
                Contact Us
              </Link>
              <div className="pt-4 mt-2 border-t border-white/10">
                <Link
                  href="/list-property"
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-base font-bold text-white transition flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> List Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'property-details' && renderPropertyDetails()}
        {activeTab === 'roommates' && renderRoommates()}
        {activeTab === 'add-property' && renderAddProperty()}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-10 lg:grid-cols-4">
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
              <p className="max-w-sm text-slate-400">
                A premium student accommodation marketplace built for modern renters and property owners. Search verified stays, contact trusted hosts, and move with confidence.
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 hover:bg-indigo-500 hover:text-white transition cursor-pointer">f</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 hover:bg-indigo-500 hover:text-white transition cursor-pointer">X</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-slate-200 hover:bg-indigo-500 hover:text-white transition cursor-pointer">in</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Explore</h4>
              <ul className="mt-6 space-y-3 text-slate-400">
                <li><button onClick={() => navigate('properties')} className="hover:text-white transition">Browse Properties</button></li>
                <li><button onClick={() => navigate('roommates')} className="hover:text-white transition">Find Roommates</button></li>
                <li><Link href="/list-property" className="hover:text-white transition">List Property</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Services</h4>
              <ul className="mt-6 space-y-3 text-slate-400">
                <li>Verified Listings</li>
                <li>Instant Booking</li>
                <li>Roommate Matching</li>
                <li>Owner Dashboard</li>
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
        </div>
      </footer>
    </div>
  );
}