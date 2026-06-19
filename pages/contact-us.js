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
  Menu,
  X,
} from 'lucide-react';

export default function ContactUsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
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
                { id: 'home', label: 'Home', href: '/' },
                { id: 'properties', label: 'Browse Properties', href: '/#properties' },
                { id: 'roommates', label: 'Find Roommates', href: '/#roommates' },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm font-semibold transition text-slate-300 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/contact-us" className="text-sm font-semibold text-white transition">
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
                { id: 'home', label: 'Home', href: '/' },
                { id: 'properties', label: 'Browse Properties', href: '/#properties' },
                { id: 'roommates', label: 'Find Roommates', href: '/#roommates' },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-left block w-full rounded-2xl px-4 py-3 text-base font-semibold text-slate-300 hover:bg-white/10 transition"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact-us"
                className="text-left block w-full rounded-2xl px-4 py-3 text-base font-semibold text-white bg-indigo-600/20 transition"
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

      <main className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-72 w-72 -translate-x-1/4 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Contact us</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Need help? Let Homivo support you.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Our team is ready to help with listings, roommate matches, and any housing questions for students and owners.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Support center</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Fast answers and personal support</h2>
                <p className="mt-4 text-slate-400">Reach out for help with property listings, roommate matching, or general Homivo questions. We’ll respond quickly with the next best step.</p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Phone</p>
                  <p className="mt-3 text-lg font-semibold text-white">+91 98765 43210</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Email</p>
                  <p className="mt-3 text-lg font-semibold text-white">support@homivo.com</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Office</p>
                  <p className="mt-3 text-lg font-semibold text-white">123 Startup Hub</p>
                  <p className="mt-2 text-slate-400">Scheme 54, Indore, MP</p>
                </article>
                <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Hours</p>
                  <p className="mt-3 text-lg font-semibold text-white">Mon - Sat</p>
                  <p className="mt-2 text-slate-400">9:00 AM - 7:00 PM</p>
                </article>
              </div>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Why choose Homivo?</p>
                <ul className="mt-4 space-y-3 text-slate-400">
                  <li>• Verified listings with student-first support</li>
                  <li>• Fast roommate matching and trusted owners</li>
                  <li>• Clear pricing and easy booking flow</li>
                </ul>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
              <div className="rounded-[2rem] bg-slate-950/90 p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-sky-300" />
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Send a request</p>
                </div>
                <h2 className="mt-4 text-3xl font-semibold text-white">We’ll respond with the next best step</h2>
                <p className="mt-3 text-slate-400">Drop a message and our team will reach out with personalized help.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Your name</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Rahul Sharma"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    placeholder="rahul@example.com"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Subject</span>
                  <input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                    placeholder="Need help with a property listing"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Message</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-sky-600"
                >
                  Send Message
                </button>
              </form>
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
            <p className="max-w-sm text-slate-400">
              Trusted student accommodation search with verified listings, roommate matching, and support for every move.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Explore</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/#properties" className="hover:text-white transition">Browse Properties</Link></li>
              <li><Link href="/#roommates" className="hover:text-white transition">Find Roommates</Link></li>
              <li><Link href="/list-property" className="hover:text-white transition">List Property</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Get support</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li>Verified Listings</li>
              <li>Quick Responses</li>
              <li>Owner Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Contact</h4>
            <div className="mt-6 space-y-4 text-slate-400">
              <p className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-indigo-400" /> 123 Startup Hub, Scheme 54, Indore, MP</p>
              <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-indigo-400" /> +91 98765 43210</p>
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
