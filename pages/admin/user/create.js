import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';
import { addUser } from '../../../lib/adminData';

export default function AdminUserCreate() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', role: 'Owner' });

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);
    if (!auth) {
      router.replace('/admin');
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addUser(form);
    router.push('/admin/user');
  };

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

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="Create User"
      subtitle="Add a new user account"
      active="user"
      onSignOut={handleSignOut}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">User creation</h2>
            <p className="mt-2 text-sm text-slate-500">Create new owner, tenant, or agent accounts.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/user')}
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Back to user list
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Arjun Singh"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="arjun@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Owner</option>
              <option>Tenant</option>
              <option>Agent</option>
            </select>
          </label>

          <button className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition">
            Create User
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
