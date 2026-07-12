import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getOwnerSession, getOwnerToken, isOwnerAuthenticated, signOutOwner } from '../../lib/ownerAuth';

const PROPERTY_STORAGE_KEY = 'stayora-owner-properties';
const REQUEST_STORAGE_KEY = 'stayora-owner-requests';

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

const setProperties = (properties) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PROPERTY_STORAGE_KEY, JSON.stringify(properties));
  }
  return properties;
};

const getRequests = () => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(REQUEST_STORAGE_KEY);
  return stored ? safeParse(stored, []) : [];
};

const setRequests = (requests) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
  }
  return requests;
};

export default function OwnerDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [owner, setOwner] = useState(null);
  const [properties, setLocalProperties] = useState([]);
  const [requests, setLocalRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');
  const [scheduleRequests, setScheduleRequests] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleActionLoading, setScheduleActionLoading] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      router.replace('/owner/login');
      return;
    }

    const session = getOwnerSession();
    setOwner(session);
    setLocalRequests(getRequests());

    const ownerId =
      session?.user_id ||
      session?._id ||
      session?.id ||
      session?.authResponse?.user?.id ||
      session?.authResponse?.data?.user?.id;

    const ownerToken = getOwnerToken();
    if (ownerToken) {
      fetch('/api/notifications/list', {
        headers: {
          Authorization: ownerToken,
        },
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
        .finally(() => {
          setNotificationsLoading(false);
        });

      fetch('/api/properties/owner-schedule-requests', {
        headers: {
          Authorization: ownerToken,
        },
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
        .finally(() => {
          setScheduleLoading(false);
        });
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
            setLocalProperties(setProperties(data.data));
          } else {
            setLocalProperties(getProperties());
          }
        })
        .catch((error) => {
          console.error('Error loading owner properties:', error);
          setLocalProperties(getProperties());
        })
        .finally(() => {
          setInitialized(true);
        });
    } else {
      setLocalProperties(getProperties());
      setInitialized(true);
    }
  }, [router]);

  const handleSignOut = () => {
    signOutOwner();
    router.push('/owner/login');
  };

  const handleScheduleAction = async (requestId, action) => {
    const ownerToken = getOwnerToken();
    if (!ownerToken) {
      setScheduleError('Authentication token not found.');
      return;
    }

    setScheduleActionLoading(requestId);
    try {
      const response = await fetch('/api/properties/owner-schedule-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ownerToken,
        },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to update schedule request.');
      }

      setScheduleRequests((prev) =>
        prev.map((item) => {
          const idValue = item.id || item._id || item.requestId || item.scheduleId;
          if (String(idValue) !== String(requestId)) return item;
          return {
            ...item,
            status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
          };
        })
      );
    } catch (error) {
      console.error('Error updating schedule request:', error);
      setScheduleError(error?.message || 'Unable to update schedule request.');
    } finally {
      setScheduleActionLoading('');
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading owner dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/90 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Owner Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back, {owner?.name || 'Owner'}.</h1>
            <p className="mt-2 text-slate-400">Manage your listings, monitor inquiries, and publish new properties from one place.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => window.document.getElementById('owner-notifications')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
            >
              Notifications {notifications.length > 0 ? `(${notifications.length})` : ''}
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition"
            >
              Sign out
            </button>
            <Link
              href="/owner/property/create"
              className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Create listing
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Your active listings</p>
            <p className="mt-4 text-4xl font-semibold text-white">{properties.length}</p>
            <p className="mt-2 text-sm text-slate-400">Listings created in this owner session.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">New inquiries</p>
            <p className="mt-4 text-4xl font-semibold text-white">{requests.length}</p>
            <p className="mt-2 text-sm text-slate-400">Visitor interest in your properties.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Account</p>
            <p className="mt-4 text-xl font-semibold text-white">{owner?.email}</p>
            <p className="mt-1 text-sm text-slate-400">{owner?.phone}</p>
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Listings</h2>
              <p className="mt-1 text-sm text-slate-400">Edit or review the properties you have created.</p>
            </div>
            <Link
              href="/owner/property/create"
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              New listing
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {properties.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">You have no listings yet.</p>
                <p className="mt-2">Create your first property to connect with student renters.</p>
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{property.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{property.address || property.location || property.city}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300 text-xs uppercase tracking-[0.2em]">
                        {property.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{property.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full bg-slate-800 px-3 py-1">₹{property.price}</span>
                      <span className="rounded-full bg-slate-800 px-3 py-1">{property.genderPreference}</span>
                      {property.amenities && (
                        <span className="rounded-full bg-slate-800 px-3 py-1">{property.amenities.length} amenities</span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                      <span>{property.ownerName || owner?.name}</span>
                      <span>•</span>
                      <span>{property.ownerEmail || owner?.email}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="owner-notifications" className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <p className="mt-1 text-sm text-slate-400">Recent account and property updates from the backend.</p>
            </div>
            <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">{notifications.length} new</span>
          </div>

          <div className="mt-6 space-y-4">
            {notificationsLoading ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Loading notifications…</p>
              </div>
            ) : notificationsError ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Unable to load notifications</p>
                <p className="mt-2">{notificationsError}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">No notifications yet.</p>
                <p className="mt-2">Notifications will appear here when there are new updates.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id || notification._id || notification._key || JSON.stringify(notification)} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="font-semibold text-white">{notification.title || notification.heading || 'New notification'}</p>
                  <p className="mt-1 text-sm text-slate-400">{notification.message || notification.body || notification.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.date || ''}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="owner-schedule-requests" className="mt-8 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Scheduled Visits</h2>
              <p className="mt-1 text-sm text-slate-400">Manage incoming schedule requests from students.</p>
            </div>
            <span className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white">{scheduleRequests.length} requests</span>
          </div>

          <div className="mt-6 space-y-4">
            {scheduleLoading ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Loading scheduled requests…</p>
              </div>
            ) : scheduleError ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">Unable to load scheduled requests</p>
                <p className="mt-2">{scheduleError}</p>
              </div>
            ) : scheduleRequests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/70 p-10 text-center text-slate-400">
                <p className="text-lg font-semibold text-white">No scheduled requests yet.</p>
                <p className="mt-2">Requests will appear here once students request visits.</p>
              </div>
            ) : (
              scheduleRequests.map((request) => {
                const requestId = request._id || request.id || request.requestId || request.scheduleId;
                const status = String(request.status || request.state || 'pending').toUpperCase();
                const isPending = status === 'PENDING';
                const requester = request.requester_id || request.requester || {};
                const property = request.property_id || request.property || {};
                const propertyImage = property.images?.[0] || property.image || '';

                return (
                  <div key={requestId || JSON.stringify(request)} className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                      {propertyImage ? (
                        <img
                          src={propertyImage}
                          alt={property.address || 'Property image'}
                          className="h-40 w-full rounded-3xl object-cover shadow-inner sm:h-full sm:w-44"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-3xl bg-slate-900 text-slate-400 shadow-inner sm:h-full sm:w-44">
                          <span>No image</span>
                        </div>
                      )}

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-white">{property.address || 'Scheduled visit'}</p>
                            <p className="mt-1 text-sm text-slate-400">Price: ₹{property.price ?? 'N/A'}</p>
                          </div>
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">{status}</span>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-900 p-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Requester</p>
                            <p className="mt-2 text-sm text-slate-100 font-semibold">{requester.name || requester.fullName || 'Unknown'}</p>
                            <p className="mt-1 text-sm text-slate-400">{requester.email || 'No email'}</p>
                            <p className="mt-1 text-sm text-slate-400">{requester.phone || 'No phone'}</p>
                          </div>
                          <div className="rounded-2xl bg-slate-900 p-4">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Scheduled for</p>
                            <p className="mt-2 text-sm text-slate-100 font-semibold">{request.date ? new Date(request.date).toLocaleDateString() : 'No date'}</p>
                            <p className="mt-1 text-sm text-slate-400">{request.time || 'No time'}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-slate-900 p-4">
                          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Message</p>
                          <p className="mt-2 text-sm text-slate-100">{request.message || 'No message provided.'}</p>
                        </div>

                        {isPending ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={scheduleActionLoading === requestId}
                              onClick={() => handleScheduleAction(requestId, 'accept')}
                              className="rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {scheduleActionLoading === requestId ? 'Accepting…' : 'Accept'}
                            </button>
                            <button
                              type="button"
                              disabled={scheduleActionLoading === requestId}
                              onClick={() => handleScheduleAction(requestId, 'reject')}
                              className="rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {scheduleActionLoading === requestId ? 'Rejecting…' : 'Reject'}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
