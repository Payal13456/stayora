import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard' },
  { label: 'Manage Users', href: '/admin/user', key: 'user' },
  { label: 'Manage Properties', href: '/admin/property', key: 'property' },
  { label: 'Settings', href: '/admin/settings', key: 'settings' }
];

export default function AdminLayout({ title, subtitle, active, onSignOut, children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-slate-950 text-white lg:flex">
          <div className="border-b border-slate-800 px-6 py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Homi<span className="text-indigo-400">vo</span></p>
            <h2 className="mt-4 text-2xl font-bold">Admin Panel</h2>
            <p className="mt-2 text-sm text-slate-400">Manage users, properties, and app settings.</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  active === item.key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-800 px-6 py-6 text-sm text-slate-500">
            <p className="font-semibold text-slate-200">Administrator</p>
            <p className="mt-1">Full access</p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{subtitle}</p>
                <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onSignOut}
                  className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
