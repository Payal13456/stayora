import Link from 'next/link';
import { Home as HomeIcon, MapPin, Phone } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard' },
  { label: 'Manage Users', href: '/admin/user', key: 'user' },
  { label: 'Manage Properties', href: '/admin/property', key: 'property' },
  { label: 'Settings', href: '/admin/settings', key: 'settings' }
];

export default function AdminLayout({ title, subtitle, active, onSignOut, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Branding */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Homivo</p>
                <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              </div>

              {/* Main Top Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active === item.key
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Profile / Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right text-xs text-slate-400">
                <p className="font-semibold text-slate-200">Administrator</p>
                <p>Full access</p>
              </div>
              <button
                onClick={onSignOut}
                className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content Header (Title & Subtitle) */}
      <div className="bg-slate-900/40 border-b border-white/5 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{subtitle}</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{title}</h1>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-4">
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
              A premium student accommodation marketplace. Search verified stays, connect with trusted hosts, and manage your properties with ease.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Quick Links</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Services</h4>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li>Verified Listings</li>
              <li>Owner Dashboard</li>
              <li>Student Matching</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Contact</h4>
            <div className="mt-6 space-y-4 text-slate-400">
              <p className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 text-indigo-400" />123 Startup Hub, Scheme 54, Indore, MP</p>
              <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-indigo-400" />+91 98765 43210</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Homivo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}