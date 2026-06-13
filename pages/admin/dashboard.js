import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../lib/adminAuth';

const stats = [
  { title: 'Properties', value: '42', subtitle: 'Total active listings' },
  { title: 'New leads', value: '13', subtitle: 'Last 24 hours' },
  { title: 'Active users', value: '284', subtitle: 'Current signed-in users' }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);
    if (!auth) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSignOut = () => {
    signOutAdmin();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your Homivo admin panel"
      active="dashboard"
      onSignOut={handleSignOut}
    >
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {stats.map((stat) => (
            <div key={stat.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{stat.title}</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-500">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">System summary</h2>
              <p className="mt-2 text-sm text-slate-500">Key metrics for admin actions and alerts.</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Stable
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">Pending approvals</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">8</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-700">Open tickets</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
              <p className="mt-2 text-sm text-slate-500">Latest user and listing events.</p>
            </div>
            <button
              onClick={() => router.push('/admin/property')}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              View properties
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {[
                  { event: 'New listing created', user: 'Arjun Singh', status: 'Completed' },
                  { event: 'User account added', user: 'Nisha Patel', status: 'Completed' },
                  { event: 'Verification request', user: 'Admin review', status: 'Pending' }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{item.event}</td>
                    <td className="px-6 py-4">{item.user}</td>
                    <td className="px-6 py-4 text-slate-600">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Action center</h2>
          <p className="mt-2 text-sm text-slate-500">Quick access links for admin tasks.</p>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/admin/user')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Add or manage users
            </button>
            <button
              onClick={() => router.push('/admin/property')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Add property listings
            </button>
            <button
              onClick={() => router.push('/admin/settings')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
            >
              Open settings
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
