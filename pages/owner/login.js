import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isOwnerAuthenticated, signInOwner } from '../../lib/ownerAuth';

export default function OwnerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOwnerAuthenticated()) {
      router.replace('/owner/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await signInOwner(email.trim(), password);
    setLoading(false);

    if (result.success) {
      router.push('/owner/dashboard');
      return;
    }

    setError(result.message || 'Invalid email or password.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900 text-center">Owner Login</h1>
        <p className="mt-3 text-sm text-slate-500 text-center">Access your Homivo owner dashboard to manage properties and requests.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="owner@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New owner? <a href="/owner/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Register here</a>
        </p>
      </div>
    </div>
  );
}
