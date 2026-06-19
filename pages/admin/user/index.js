import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { isAdminAuthenticated, signOutAdmin } from '../../../lib/adminAuth';
import { getUsers, updateUser, deleteUser } from '../../../lib/adminData';

export default function AdminUserList() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, name: '', email: '', role: 'Owner' });

  useEffect(() => {
    const auth = isAdminAuthenticated();
    setAuthenticated(auth);
    setLoading(false);
    if (!auth) {
      router.replace('/admin');
      return;
    }
    setUsers(getUsers());
  }, [router]);

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditForm(user);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateUser(editForm);
    setUsers(getUsers());
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user permanently?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  const handleSignOut = () => {
    signOutAdmin();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Checking admin access...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <AdminLayout
      title="User List"
      subtitle="Browse, edit, or remove accounts"
      active="user"
      onSignOut={handleSignOut}
    >
      <div className="flex flex-col gap-6">
        {/* Header Action Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Users</h2>
            <p className="mt-1 text-sm text-slate-400">View and manage all user accounts here.</p>
          </div>
          <Link
            href="/admin/user/create"
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
          >
            Create user
          </Link>
        </div>

        {/* Users Card Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-lg backdrop-blur-sm">
              {editingId === user.id ? (
                /* Edit State Form */
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option className="bg-slate-900">Owner</option>
                      <option className="bg-slate-900">Tenant</option>
                      <option className="bg-slate-900">Agent</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View State Card */
                <div className="flex flex-col justify-between h-full gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white tracking-wide">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-400 truncate">{user.email}</p>
                    <span className="mt-3 inline-flex rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="flex-1 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}