import React, { useState } from "react";
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
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_PROPERTIES = [
  {
    id: 1,
    type: "PG",
    title: "Sunshine Girls PG",
    location: "Vijay Nagar, Indore",
    price: 6500,
    gender: "Female",
    amenities: ["WiFi", "Food Included", "AC", "Laundry"],
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    type: "Flat",
    title: "Spacious 2BHK Near Campus",
    location: "Bhawarkua, Indore",
    price: 12000,
    gender: "Any",
    amenities: ["Semi-furnished", "Parking", "Security"],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    type: "Hostel",
    title: "Elite Boys Hostel",
    location: "Palasia, Indore",
    price: 5500,
    gender: "Male",
    amenities: ["Meals", "Gym", "Study Room"],
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    type: "PG",
    title: "Comfort Stay Co-ed PG",
    location: "Koregaon Park, Pune",
    price: 8000,
    gender: "Any",
    amenities: ["AC", "WiFi", "Cleaning", "TV"],
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
  },
];

const TOP_CITIES = [
  {
    name: "Indore",
    count: "150+",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Bhopal",
    count: "90+",
    image:
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Gwalior",
    count: "60+",
    image:
      "https://images.unsplash.com/photo-1600021676839-b97c413e2d67?auto=format&fit=crop&q=80&w=800",
  },
  {
    name: "Jabalpur",
    count: "45+",
    image:
      "https://images.unsplash.com/photo-1598284698544-2454685025f1?auto=format&fit=crop&q=80&w=800",
  },
];

const INITIAL_ROOMMATES = [
  {
    id: 1,
    name: "Rahul Sharma",
    age: 21,
    role: "Student - Engineering",
    budget: 5000,
    location: "Indore",
    preferences: ["Non-smoker", "Vegetarian", "Night Owl"],
    bio: "Looking for a chill roommate to share a 2BHK near Bhawarkua. I study late at night and keep things clean.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Priya Patel",
    age: 22,
    role: "Student - Medical",
    budget: 7000,
    location: "Pune",
    preferences: ["Early Bird", "Clean freak", "No pets"],
    bio: "Medical student looking for a peaceful environment. I prefer a female roommate who values quiet study time.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Amit Kumar",
    age: 24,
    role: "Working Professional",
    budget: 8000,
    location: "Indore",
    preferences: ["Any", "Foodie"],
    bio: "Just moved to the city for a new job. Looking for a flatmate to hunt for a 2BHK together.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [roommates, setRoommates] = useState(INITIAL_ROOMMATES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- NAVIGATION ---
  const navigate = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // --- VIEWS ---
  const renderHome = () => (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Find Your Perfect Student Home
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-10 text-indigo-100">
            Discover verified PGs, hostels, flats, and the perfect roommates in
            your new city. Moving made simple for students.
          </p>

          <div className="w-full max-w-3xl bg-white p-2 rounded-full shadow-lg flex items-center">
            <MapPin className="w-6 h-6 text-gray-400 ml-4 hidden sm:block" />
            <input
              type="text"
              placeholder="Enter city, locality or landmark..."
              className="w-full px-4 py-3 text-gray-800 bg-transparent outline-none rounded-full"
            />
            <button
              onClick={() => navigate("properties")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What are you looking for?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            {
              title: "PGs",
              icon: Building,
              color: "bg-blue-100 text-blue-600",
              action: () => navigate("properties"),
            },
            {
              title: "Hostels",
              icon: Bed,
              color: "bg-green-100 text-green-600",
              action: () => navigate("properties"),
            },
            {
              title: "Flats",
              icon: HomeIcon,
              color: "bg-purple-100 text-purple-600",
              action: () => navigate("properties"),
            },
            {
              title: "Roommates",
              icon: Users,
              color: "bg-orange-100 text-orange-600",
              action: () => navigate("roommates"),
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={cat.action}
              className="cursor-pointer group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all"
            >
              <div
                className={`p-4 rounded-full mb-4 ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900">{cat.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Top Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Top Cities
            </h2>
            <p className="text-gray-500 mt-2">
              Find the best properties in popular student hubs.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TOP_CITIES.map((city, idx) => (
            <div
              key={idx}
              onClick={() => navigate("properties")}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-xl font-bold text-white mb-1">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-300 font-medium">
                  {city.count} Properties
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action for owners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-indigo-100">
          <div className="mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Are you a Property Owner?
            </h2>
            <p className="text-gray-600 mb-0 max-w-lg">
              List your PG, hostel, or flat on our platform to reach thousands
              of verified students looking for accommodation in your area.
            </p>
          </div>
          <button
            onClick={() => navigate("add-property")}
            className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition whitespace-nowrap shadow-sm flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            List Your Property
          </button>
        </div>
      </section>
    </div>
  );

  const renderProperties = () => {
    const [filter, setFilter] = useState("All");

    const filteredProperties =
      filter === "All"
        ? properties
        : properties.filter((p) => p.type === filter);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Explore Properties
            </h1>
            <p className="text-gray-500 mt-2">
              Find the perfect place that fits your budget and lifestyle.
            </p>
          </div>

          {/* Filters */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-max">
            {["All", "PG", "Hostel", "Flat"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm">
                  {property.type}
                </div>
                <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white flex items-center shadow-sm">
                  <User className="w-3 h-3 mr-1" /> {property.gender}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {property.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />{" "}
                  {property.location}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 flex items-center">
                      <IndianRupee className="w-5 h-5" />
                      {property.price}
                    </span>
                    <span className="text-gray-500 text-xs">/ month</span>
                  </div>
                  <button className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProperties.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500">
                No properties found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRoommates = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find a Roommate</h1>
        <p className="text-gray-500 mt-2">
          Connect with students looking for shared accommodation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roommates.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {person.name}, {person.age}
                </h3>
                <p className="text-sm text-indigo-600 font-medium">
                  {person.role}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              "{person.bio}"
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                Preferred Loc:{" "}
                <span className="font-medium text-gray-900 ml-1">
                  {person.location}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                Budget:{" "}
                <span className="font-medium text-gray-900 ml-1">
                  Up to ₹{person.budget}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {person.preferences.map((pref, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {pref}
                </span>
              ))}
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl text-sm font-semibold transition">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProperty = () => {
    const [formData, setFormData] = useState({
      title: "",
      type: "PG",
      location: "",
      price: "",
      gender: "Any",
      amenities: "",
      image: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newProperty = {
        id: Date.now(),
        ...formData,
        price: parseInt(formData.price),
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        image:
          formData.image ||
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
      };

      setProperties([newProperty, ...properties]);
      setSubmitted(true);
      setTimeout(() => {
        navigate("properties");
        setSubmitted(false);
      }, 2000);
    };

    if (submitted) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Property Listed!
          </h2>
          <p className="text-gray-500">
            Your property has been successfully added to our platform.
            Redirecting to listings...
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 md:p-10">
          <div className="mb-8 border-b border-gray-100 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              List Your Property
            </h1>
            <p className="text-gray-500 mt-2">
              Fill in the details below to reach thousands of students.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Property Title *
                </label>
                <input
                  required
                  name="title"
                  onChange={handleChange}
                  value={formData.title}
                  type="text"
                  placeholder="e.g. Sunrise Boys PG"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Property Type *
                </label>
                <select
                  name="type"
                  onChange={handleChange}
                  value={formData.type}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                >
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Location/Address *
                </label>
                <input
                  required
                  name="location"
                  onChange={handleChange}
                  value={formData.location}
                  type="text"
                  placeholder="City, Area (e.g. Kothrud, Pune)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Monthly Rent (₹) *
                </label>
                <input
                  required
                  name="price"
                  onChange={handleChange}
                  value={formData.price}
                  type="number"
                  placeholder="5000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Preferred Gender
                </label>
                <select
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                >
                  <option value="Any">Any / Co-ed</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Image URL (Optional)
                </label>
                <input
                  name="image"
                  onChange={handleChange}
                  value={formData.image}
                  type="url"
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Amenities (Comma separated)
              </label>
              <textarea
                name="amenities"
                onChange={handleChange}
                value={formData.amenities}
                rows="3"
                placeholder="WiFi, AC, Laundry, Meals Included..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none transition resize-none"
              ></textarea>
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => navigate("home")}
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl mr-3 group-hover:bg-indigo-700 transition">
                <HomeIcon className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tight text-gray-900">
                Stay<span className="text-indigo-600">ora</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              {[
                { id: "home", label: "Home" },
                { id: "properties", label: "Browse Properties" },
                { id: "roommates", label: "Find Roommates" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-sm font-semibold transition ${
                    activeTab === item.id
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="w-px h-6 bg-gray-300"></div>

              <button
                onClick={() => navigate("add-property")}
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> List Property
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full left-0 z-40">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              {[
                { id: "home", label: "Home" },
                { id: "properties", label: "Browse Properties" },
                { id: "roommates", label: "Find Roommates" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`text-left px-4 py-3 rounded-lg text-base font-semibold transition ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t border-gray-100">
                <button
                  onClick={() => navigate("add-property")}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg text-base font-bold transition flex items-center justify-center"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> List Property
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        {activeTab === "home" && renderHome()}
        {activeTab === "properties" && renderProperties()}
        {activeTab === "roommates" && renderRoommates()}
        {activeTab === "add-property" && renderAddProperty()}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4 text-white">
              <HomeIcon className="w-6 h-6 mr-2 text-indigo-400" />
              <span className="font-black text-2xl tracking-tight">
                Stay<span className="text-indigo-400">ora</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              The ultimate platform connecting students with the best
              accommodations and compatible roommates across India.
            </p>
            <div className="flex space-x-4">
              {/* Dummy social icons placeholders */}
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white cursor-pointer transition">
                <span className="font-bold">f</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white cursor-pointer transition">
                <span className="font-bold">X</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white cursor-pointer transition">
                <span className="font-bold">in</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigate("properties")}
                  className="hover:text-indigo-400 transition"
                >
                  Browse PGs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("roommates")}
                  className="hover:text-indigo-400 transition"
                >
                  Find Roommates
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("add-property")}
                  className="hover:text-indigo-400 transition"
                >
                  List Property
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-indigo-400 shrink-0 mt-0.5" />
                <span>123 Startup Hub, Scheme 54, Indore, MP</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-indigo-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Stayora. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
