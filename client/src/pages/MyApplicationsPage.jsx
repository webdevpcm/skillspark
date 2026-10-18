import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusChip from '../components/StatusChip';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Briefcase, ExternalLink, ArrowRight } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchApps() {
      try {
        setLoading(true);
        const res = await api.get('/applications/mine');
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your applications..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track the review and decision progress across all your submitted roles.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">You haven't applied to any opportunities yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Discover roles that match your skill profile and submit your first application.
          </p>
          <Link
            to="/opportunities"
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-teal-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {app.opportunity?.type || 'Role'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {app.opportunity?.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700">
                    {app.opportunity?.owner?.startupProfile?.startupName ||
                      app.opportunity?.owner?.recruiterProfile?.companyName ||
                      app.opportunity?.owner?.name}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <StatusChip status={app.status} />
                  <Link
                    to={`/opportunities/${app.opportunity?._id}`}
                    className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-slate-50"
                    title="View Opportunity"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {app.coverNote && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">
                    Your Cover Note
                  </span>
                  "{app.coverNote}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
