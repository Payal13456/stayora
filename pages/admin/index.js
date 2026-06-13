import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAdminAuthenticated, signInAdmin } from '../../lib/adminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (signInAdmin(username.trim(), password)) {
      router.push('/admin/dashboard');
      return;
    }

    setError('Invalid credentials. Use admin / password123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6 text-center">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-8 text-center">
          Sign in to access the admin dashboard for Homivo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              placeholder="password123"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Admin username: <strong>admin</strong></p>
          <p>Admin password: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}
