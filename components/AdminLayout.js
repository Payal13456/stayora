import Link from 'next/link';
import {
  Bell,
  ClipboardList,
  Grid,
  Layers,
  LogOut,
  Search,
  Settings2,
  UserCircle,
  Users2,
  Building2,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', key: 'dashboard', icon: Grid },
  { label: 'Manage Students', href: '/admin/user?role=Student', key: 'students', icon: Users2 },
  { label: 'Manage Owners', href: '/admin/user?role=Owner', key: 'owners', icon: UserCircle },
  { label: 'Manage Properties', href: '/admin/property', key: 'property', icon: Building2 },
  { label: 'Settings', href: '/admin/settings', key: 'settings', icon: Settings2 }
];

export default function AdminLayout({ title, subtitle, active, onSignOut, children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="lg:flex">
        <aside className="hidden lg:flex h-screen flex-col w-72 xl:w-80 shrink-0 bg-slate-950 border-r border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-600 text-base font-semibold text-white">
              H
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300">AdminLTE</p>
              <h1 className="text-lg font-semibold text-white">Homivo</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="mt-5">
              <p className="px-3 text-[10px] uppercase tracking-[0.35em] text-slate-500">Main navigation</p>
              <div className="mt-3 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-3xl px-3 py-2.5 text-xs font-semibold transition ${
                        active === item.key
                          ? 'bg-slate-800 text-white shadow-lg shadow-slate-950/40'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sky-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 px-5 py-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-inner shadow-slate-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Admin</p>
                  <p className="mt-1 text-xs font-semibold text-white">System Monitor</p>
                </div>
                <div className="rounded-3xl bg-slate-800 p-3 text-slate-300">
                  <ClipboardList className="h-4 w-4" />
                </div>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="mt-4 w-full rounded-3xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-800 bg-slate-950/95 px-4 py-3 lg:px-6">
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="hidden h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-slate-400 lg:flex">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300">{subtitle}</p>
                  <h1 className="text-xl font-semibold text-white">{title}</h1>
                </div>
              </div>

              <div className="hidden items-center gap-2 lg:flex">
                <button className="rounded-3xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 transition hover:bg-slate-800">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="rounded-3xl border border-slate-800 bg-slate-900/80 p-2.5 text-slate-300 transition hover:bg-slate-800">
                  <MessageSquare className="h-4 w-4" />
                </button>
                <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200">
                  <UserCircle className="h-4 w-4 text-sky-400" />
                  <span className="text-xs">Alexander Pierce</span>
                </div>
              </div>
            </div>
          </header>

          <main className="py-6">
            <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
