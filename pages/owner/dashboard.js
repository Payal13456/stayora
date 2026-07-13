import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OwnerLayout from '../../components/OwnerLayout';
import { getOwnerSession, getOwnerToken, isOwnerAuthenticated } from '../../lib/ownerAuth';

const PROPERTY_STORAGE_KEY = 'stayora-owner-properties';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const getProperties = () => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(PROPERTY_STORAGE_KEY);
  return stored ? safeParse(stored, []) : [];
};

export default function OwnerDashboard() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [owner, setOwner] = useState(null);
  const [properties, setProperties] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [scheduleRequests, setScheduleRequests] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    if (!auth) {
      router.replace('/owner/login');
      return;
    }

    const session = getOwnerSession();
    setOwner(session);
    setProperties(getProperties());

    const ownerId =
      session?.user_id ||
      session?._id ||
      session?.id ||
      session?.authResponse?.user?.id ||
      session?.authResponse?.data?.user?.id;

    const ownerToken = getOwnerToken();
    if (ownerToken) {
      fetch('/api/notifications/list', {
        headers: { Authorization: ownerToken }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data)) {
            setNotifications(data.data);
          } else {
            setNotificationsError(data?.message || 'Unable to load notifications.');
          }
        })
        .catch((error) => {
          console.error('Error loading notifications:', error);
          setNotificationsError('Unable to load notifications.');
        })
        .finally(() => setNotificationsLoading(false));

      fetch('/api/properties/owner-schedule-requests', {
        headers: { Authorization: ownerToken }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data)) {
            setScheduleRequests(data.data);
          } else {
            setScheduleError(data?.message || 'Unable to load schedule requests.');
          }
        })
        .catch((error) => {
          console.error('Error loading schedule requests:', error);
          setScheduleError('Unable to load schedule requests.');
        })
        .finally(() => setScheduleLoading(false));
    } else {
      setNotificationsError('Authentication token not found.');
      setNotificationsLoading(false);
      setScheduleError('Authentication token not found.');
      setScheduleLoading(false);
    }

    if (ownerId) {
      fetch(`/api/properties?user_id=${encodeURIComponent(ownerId)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data)) {
            setProperties(data.data);
          }
        })
        .catch((error) => {
          console.error('Error loading owner properties:', error);
        })
        .finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, [router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading owner dashboard...</p>
      </div>
    );
  }

  const statusCount = (status) =>
    scheduleRequests.filter((request) =>
      String(request.status || request.state || 'pending').toUpperCase() === status
    ).length;

  return (
    <OwnerLayout title="Dashboard" subtitle="Your owner analytics at a glance" active="dashboard">
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Properties</p>
          <p className="mt-4 text-4xl font-semibold text-white">{properties.length}</p>
          <p className="mt-2 text-sm text-slate-400">Active listings on your account.</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Pending visits</p>
          <p className="mt-4 text-4xl font-semibold text-white">{statusCount('PENDING')}</p>
          <p className="mt-2 text-sm text-slate-400">Requests waiting for your action.</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Accepted visits</p>
          <p className="mt-4 text-4xl font-semibold text-white">{statusCount('ACCEPTED')}</p>
          <p className="mt-2 text-sm text-slate-400">Confirmed schedule requests.</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Notifications</p>
          <p className="mt-4 text-4xl font-semibold text-white">{notifications.length}</p>
          <p className="mt-2 text-sm text-slate-400">New notifications for your account.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Rejected visits</p>
          <p className="mt-4 text-4xl font-semibold text-white">{statusCount('REJECTED')}</p>
          <p className="mt-2 text-sm text-slate-400">Requests you declined.</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Cancelled visits</p>
          <p className="mt-4 text-4xl font-semibold text-white">{statusCount('CANCELLED')}</p>
          <p className="mt-2 text-sm text-slate-400">Visits cancelled by students or admin.</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Account</p>
          <p className="mt-4 text-4xl font-semibold text-white">{owner?.name || 'Owner'}</p>
          <p className="mt-2 text-sm text-slate-400">{owner?.email || ''}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => router.push('/owner/property')}
          className="rounded-3xl border border-slate-700 bg-slate-900/95 px-6 py-6 text-left transition hover:bg-slate-800"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Manage Property</p>
          <p className="mt-3 text-xl font-semibold text-white">Edit, delete, and view your listings.</p>
        </button>

        <button
          type="button"
          onClick={() => router.push('/owner/schedule')}
          className="rounded-3xl border border-slate-700 bg-slate-900/95 px-6 py-6 text-left transition hover:bg-slate-800"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Scheduled visits</p>
          <p className="mt-3 text-xl font-semibold text-white">Review incoming visit requests.</p>
        </button>

        <button
          type="button"
          onClick={() => router.push('/owner/notifications')}
          className="rounded-3xl border border-slate-700 bg-slate-900/95 px-6 py-6 text-left transition hover:bg-slate-800"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Notifications</p>
          <p className="mt-3 text-xl font-semibold text-white">See your latest updates.</p>
        </button>
      </div>
    </OwnerLayout>
  );
}
