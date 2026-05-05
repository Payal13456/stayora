import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRouter } from 'next/router';
import { isAdminAuthenticated, signOutAdmin } from '../../lib/adminAuth';

export default function AdminSettings() {
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
      title="Settings"
      subtitle="Admin configuration and platform controls"
      active="settings"
      onSignOut={handleSignOut}
    >
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Platform settings</h2>
          <p className="mt-3 text-sm text-slate-500">This section will hold admin controls for business rules and account settings.</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Feature toggles</p>
              <p className="mt-2 text-sm text-slate-600">Enable or disable platform modules from the admin panel.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Security settings</p>
              <p className="mt-2 text-sm text-slate-600">Manage access controls and session policies for admin users.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Protected admin route</h2>
          <p className="mt-3 text-sm text-slate-600">This page is available only after signing in at <strong>/admin</strong>.</p>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-700">Main admin dashboard:</p>
            <p className="mt-2 text-slate-900">/admin/dashboard</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
