import { useState } from 'react';
import Link from 'next/link';
import {
  Home as HomeIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Users,
  Building,
  Bed,
  PlusCircle,
} from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailSubject = encodeURIComponent(formData.subject || 'Homivo support request');
    const emailBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    window.location.href = `mailto:support@homivo.com?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-xl bg-indigo-600 p-2 text-white transition group-hover:bg-indigo-700">
                <HomeIcon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Homi<span className="text-indigo-600">vo</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="text-sm font-semibold transition text-slate-600 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/#properties" className="text-sm font-semibold transition text-slate-600 hover:text-indigo-600">
                Browse Properties
              </Link>
              <Link href="/#roommates" className="text-sm font-semibold transition text-slate-600 hover:text-indigo-600">
                Find Roommates
              </Link>
              <Link href="/contact-us" aria-current="page" className="text-sm font-semibold transition text-indigo-600">
                Contact Us
              </Link>

              <div className="w-px h-6 bg-gray-300"></div>

              <Link
                href="/list-property"
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> List Property
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-8 md:p-10 shadow-sm border border-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Contact us</p>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
              Talk to the Homivo team
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Need help finding accommodation, posting a property, or connecting with a roommate? Send us a note and we’ll get back quickly.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 font-semibold text-slate-900">
                  <Phone className="h-5 w-5 text-indigo-600" /> Phone
                </div>
                <p className="mt-2 text-slate-600">+91 98765 43210</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 font-semibold text-slate-900">
                  <Mail className="h-5 w-5 text-indigo-600" /> Email
                </div>
                <p className="mt-2 text-slate-600">support@homivo.com</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 font-semibold text-slate-900">
                  <MapPin className="h-5 w-5 text-indigo-600" /> Office
                </div>
                <p className="mt-2 text-slate-600">123 Startup Hub, Scheme 54, Indore, MP</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3 font-semibold text-slate-900">
                  <Clock className="h-5 w-5 text-indigo-600" /> Hours
                </div>
                <p className="mt-2 text-slate-600">Mon - Sat, 9:00 AM - 7:00 PM</p>
              </article>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-indigo-50 p-5 border border-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Roommate help</p>
                <p className="mt-1 text-sm text-slate-600">We can help you connect faster.</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-5 border border-indigo-100">
                <Building className="h-6 w-6 text-indigo-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Property listing</p>
                <p className="mt-1 text-sm text-slate-600">Support for owners and agents.</p>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-5 border border-indigo-100">
                <Bed className="h-6 w-6 text-indigo-600" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Accommodation search</p>
                <p className="mt-1 text-sm text-slate-600">Find PGs, flats, and hostels.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-indigo-600 p-8 md:p-10 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-indigo-200" />
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Send a message</p>
            </div>
            <h2 className="mt-4 text-3xl font-bold">We’ll respond with the next best step</h2>
            <p className="mt-3 text-indigo-100">
              Tell us what you need and we’ll reply by email with the right guidance.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-indigo-50">Your name</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-100/70 outline-none focus:border-white/40"
                  placeholder="Rahul Sharma"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-indigo-50">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-100/70 outline-none focus:border-white/40"
                  placeholder="rahul@example.com"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-indigo-50">Subject</span>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-100/70 outline-none focus:border-white/40"
                  placeholder="Need help with a property listing"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-indigo-50">Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-100/70 outline-none focus:border-white/40 resize-none"
                  placeholder="Tell us how we can help..."
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4 text-white">
              <HomeIcon className="w-6 h-6 mr-2 text-indigo-400" />
              <span className="font-black text-2xl tracking-tight">
                Homi<span className="text-indigo-400">vo</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              The ultimate platform connecting students with the best accommodations and compatible roommates across India.
            </p>
            <div className="flex space-x-4">
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
              <li><Link href="/" className="hover:text-indigo-400 transition">Home</Link></li>
              <li><Link href="/#properties" className="hover:text-indigo-400 transition">Browse Properties</Link></li>
              <li><Link href="/#roommates" className="hover:text-indigo-400 transition">Find Roommates</Link></li>
              <li><Link href="/list-property" className="hover:text-indigo-400 transition">List Property</Link></li>
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
          &copy; {new Date().getFullYear()} Homivo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
