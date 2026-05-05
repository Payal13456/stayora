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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700">Checking admin access...</p>
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Users</h2>
            <p className="mt-1 text-sm text-slate-500">View and manage all user accounts here.</p>
          </div>
          <Link
            href="/admin/user/create"
            className="inline-flex items-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Create user
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {editingId === user.id ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={handleChange}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option>Owner</option>
                      <option>Tenant</option>
                      <option>Agent</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSave}
                      className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">{user.role}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="rounded-2xl border border-indigo-600 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-2xl border border-red-600 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
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
