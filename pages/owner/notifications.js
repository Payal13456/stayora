import { useEffect, useState } from 'react';
import OwnerLayout from '../../components/OwnerLayout';
import { getOwnerSession, getOwnerToken, isOwnerAuthenticated } from '../../lib/ownerAuth';

export default function OwnerNotifications() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      window.location.replace('/owner/login');
      return;
    }

    const ownerToken = getOwnerToken();
    if (!ownerToken) {
      setError('Authentication token not found.');
      setLoading(false);
      setInitialized(true);
      return;
    }

    fetch('/api/notifications/list', {
      headers: { Authorization: ownerToken }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        } else {
          setError(data?.message || 'Unable to load notifications.');
        }
      })
      .catch((error) => {
        console.error('Error loading notifications:', error);
        setError('Unable to load notifications.');
      })
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <OwnerLayout title="Notifications" subtitle="Review your latest updates" active="notifications">
      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-sm text-slate-400">Recent updates from the owner backend.</p>
          </div>
          <span className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">{notifications.length} new</span>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Loading notifications…</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Unable to load notifications</p>
              <p className="mt-2">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">No notifications yet.</p>
              <p className="mt-2">Notifications will appear here when there are new updates.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id || notification._id || notification._key || JSON.stringify(notification)}
                className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5"
              >
                <p className="font-semibold text-white">{notification.title || notification.heading || 'New notification'}</p>
                <p className="mt-1 text-sm text-slate-400">{notification.message || notification.body || notification.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.date || ''}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </OwnerLayout>
  );
}
