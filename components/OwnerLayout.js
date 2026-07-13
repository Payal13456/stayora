import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bell, CalendarDays, Grid, LayoutGrid, LogOut } from 'lucide-react';
import { signOutOwner } from '../lib/ownerAuth';

const navItems = [
  { label: 'Dashboard', href: '/owner/dashboard', key: 'dashboard', icon: Grid },
  { label: 'Manage Property', href: '/owner/property', key: 'property', icon: LayoutGrid },
  { label: 'Scheduled visits', href: '/owner/schedule', key: 'schedule', icon: CalendarDays },
  { label: 'Notifications', href: '/owner/notifications', key: 'notifications', icon: Bell }
];

export default function OwnerLayout({ title, subtitle, active, children }) {
  const router = useRouter();

  const handleSignOut = () => {
    signOutOwner();
    router.push('/owner/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="lg:flex">
        <aside className="hidden lg:flex h-screen flex-col w-72 xl:w-80 shrink-0 bg-slate-950 border-r border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-600 text-base font-semibold text-white">
              O
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300">Owner Panel</p>
              <h1 className="text-lg font-semibold text-white">Stayora</h1>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-5">
            <p className="px-3 text-[10px] uppercase tracking-[0.35em] text-slate-500">Navigation</p>
            <div className="mt-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-semibold transition ${
                      active === item.key
                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-950/40'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sky-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-slate-800 px-5 py-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-inner shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Account</p>
                  <p className="mt-1 text-xs font-semibold text-white">Owner Dashboard</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-3xl bg-slate-800 p-3 text-slate-300 transition hover:bg-slate-700"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-700 bg-slate-950/95 px-4 py-5 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-sky-300">{subtitle}</p>
                  <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="rounded-3xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                    Owner panel
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
