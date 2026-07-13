import { useEffect, useState } from 'react';
import OwnerLayout from '../../components/OwnerLayout';
import { getOwnerSession, getOwnerToken, isOwnerAuthenticated } from '../../lib/ownerAuth';

const scheduleStatuses = ['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];

export default function OwnerSchedule() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [scheduleRequests, setScheduleRequests] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleFilter, setScheduleFilter] = useState('ALL');
  const [scheduleActionLoading, setScheduleActionLoading] = useState('');

  useEffect(() => {
    const auth = isOwnerAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      window.location.replace('/owner/login');
      return;
    }

    const ownerToken = getOwnerToken();
    if (!ownerToken) {
      setScheduleError('Authentication token not found.');
      setScheduleLoading(false);
      setInitialized(true);
      return;
    }

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
      .finally(() => {
        setScheduleLoading(false);
        setInitialized(true);
      });
  }, []);

  const normalizeScheduleStatus = (request) => String(request.status || request.state || 'pending').toUpperCase();
  const filteredScheduleRequests = scheduleRequests.filter((request) => {
    const status = normalizeScheduleStatus(request);
    return scheduleFilter === 'ALL' || status === scheduleFilter;
  });
  const scheduleCounts = scheduleRequests.reduce((counts, request) => {
    const status = normalizeScheduleStatus(request);
    counts[status] = (counts[status] || 0) + 1;
    counts.ALL = scheduleRequests.length;
    return counts;
  }, { ALL: scheduleRequests.length });

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
          Authorization: ownerToken
        },
        body: JSON.stringify({ requestId, action })
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || 'Unable to update schedule request.');
      }
      setScheduleRequests((prev) =>
        prev.map((item) => {
          const idValue = item.id || item._id || item.requestId || item.scheduleId;
          if (String(idValue) !== String(requestId)) return item;
          return { ...item, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' };
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
        <p>Loading scheduled visits...</p>
      </div>
    );
  }

  return (
    <OwnerLayout title="Scheduled visits" subtitle="Review incoming visit requests" active="schedule">
      <section className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Scheduled visits</h2>
            <p className="mt-1 text-sm text-slate-400">Filter requests by status and respond to students.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {scheduleStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setScheduleFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  scheduleFilter === status
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                {status !== 'ALL' ? ` (${scheduleCounts[status] || 0})` : ` (${scheduleRequests.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {scheduleLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Loading scheduled requests…</p>
            </div>
          ) : scheduleError ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Unable to load scheduled requests</p>
              <p className="mt-2">{scheduleError}</p>
            </div>
          ) : filteredScheduleRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">No schedule requests in this category.</p>
              <p className="mt-2">Try another filter or check All visits.</p>
            </div>
          ) : (
            filteredScheduleRequests.map((request) => {
              const requestId = request._id || request.id || request.requestId || request.scheduleId;
              const status = String(request.status || request.state || 'pending').toUpperCase();
              const isPending = status === 'PENDING';
              const requester = request.requester_id || request.requester || {};
              const property = request.property_id || request.property || {};
              const propertyImage = property.images?.[0] || property.image || '';

              return (
                <div key={requestId || JSON.stringify(request)} className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
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
    </OwnerLayout>
  );
}
