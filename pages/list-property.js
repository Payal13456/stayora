import Link from 'next/link';
import { Home as HomeIcon, PlusCircle, MapPin, Phone } from 'lucide-react';

export default function ListPropertyPage() {

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
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Owner access</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Login or register to continue</h2>
                  </div>
                </div>
                <p className="mt-4 text-slate-400">Use your owner account to publish listings, manage properties, and receive visiting requests.</p>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
                  <h3 className="text-lg font-semibold text-white">Already an owner?</h3>
                  <p className="mt-2 text-slate-400">Sign in to access your dashboard and manage your listings.</p>
                  <a
                    href="/owner/login"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-3xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                  >
                    Owner Login
                  </a>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6">
                  <h3 className="text-lg font-semibold text-white">New owner?</h3>
                  <p className="mt-2 text-slate-400">Create an account and start listing properties for students.</p>
                  <a
                    href="/owner/register"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-3xl border border-indigo-600 bg-slate-900 px-6 py-4 text-sm font-semibold text-indigo-100 hover:bg-indigo-700 transition"
                  >
                    Register as Owner
                  </a>
                </div>
              </div>
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
