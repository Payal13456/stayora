import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerOwner } from '../../lib/ownerAuth';

export default function OwnerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await registerOwner({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      college: form.college.trim(),
      password: form.password
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.push('/owner/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900 text-center">Owner Registration</h1>
        <p className="mt-3 text-sm text-slate-500 text-center">Create your owner account and start listing properties for students.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Your full name"
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
              placeholder="owner@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Phone
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="9876543210"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            College
            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Your college name"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Create a password"
            />
          </label>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700 transition">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <a href="/owner/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</a>
        </p>
      </div>
    </div>
  );
}
