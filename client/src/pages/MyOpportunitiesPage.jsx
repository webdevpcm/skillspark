import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import StatusChip from '../components/StatusChip';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Briefcase,
  Users,
  PlusCircle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';

export default function MyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMyOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/opportunities/mine');
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
        if (res.data.opportunities.length > 0 && !selectedOppId) {
          setSelectedOppId(res.data.opportunities[0]._id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOpportunities();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      fetchMyOpportunities();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCloseOpp = async (oppId) => {
    if (!window.confirm('Close this opportunity for new applications?')) return;
    try {
      await api.patch(`/opportunities/${oppId}/close`);
      fetchMyOpportunities();
    } catch (err) {
      alert('Failed to close opportunity: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your posted opportunities..." />;
  }

  const selectedOpp = opportunities.find((o) => o._id === selectedOppId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Postings & Applicants</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your active opportunities, review incoming candidates, and update hiring statuses.
          </p>
        </div>

        <Link
          to="/post-opportunity"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">You haven't posted any opportunities yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Publish a role to start receiving matched candidates and review applicants.
          </p>
          <Link
            to="/post-opportunity"
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm"
          >
            Post Your First Role
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Postings Column */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
              Active Postings ({opportunities.length})
            </span>
            {opportunities.map((opp) => {
              const isSelected = opp._id === selectedOppId;
              return (
                <div
                  key={opp._id}
                  onClick={() => setSelectedOppId(opp._id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {opp.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      opp.status === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {opp.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{opp.title}</h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-teal-800">
                      <Users className="w-3.5 h-3.5" />
                      <span>{opp.applicationCount || 0} Applicants</span>
                    </span>
                    <span>{new Date(opp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Applicants Detail Column */}
          <div className="lg:col-span-2">
            {selectedOpp ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                        {selectedOpp.type}
                      </span>
                      {selectedOpp.remote && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Remote
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">{selectedOpp.title}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedOpp.applications?.length || 0} candidate applicants submitted
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/opportunities/${selectedOpp._id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      View Public Role
                    </Link>
                    {selectedOpp.status === 'open' && (
                      <button
                        onClick={() => handleCloseOpp(selectedOpp._id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-50"
                      >
                        Close Role
                      </button>
                    )}
                  </div>
                </div>

                {/* Applicants List */}
                {(!selectedOpp.applications || selectedOpp.applications.length === 0) ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">No applicants yet for this posting</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Candidates whose skills match will appear here once they apply.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Applicants List
                    </h3>
                    {selectedOpp.applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{app.applicant?.name}</h4>
                            <p className="text-xs text-slate-500">
                              {app.applicant?.email} • {app.applicant?.seekerProfile?.experienceLevel || 'Candidate'}
                              {app.applicant?.seekerProfile?.education?.college ? ` • ${app.applicant.seekerProfile.education.college}` : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500">Status:</span>
                            <StatusChip status={app.status} />
                          </div>
                        </div>

                        {/* Candidate Skills */}
                        {app.applicant?.seekerProfile?.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {app.applicant.seekerProfile.skills.map((s) => (
                              <SkillTag key={s} skill={s} />
                            ))}
                          </div>
                        )}

                        {/* Cover Note */}
                        {app.coverNote && (
                          <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                            <span className="font-bold block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                              Cover Note:
                            </span>
                            "{app.coverNote}"
                          </div>
                        )}

                        {/* Status Change Action Buttons */}
                        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400">
                            Applied on {new Date(app.createdAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted'].map((st) => (
                              <button
                                key={st}
                                disabled={updatingId === app._id || app.status === st}
                                onClick={() => handleStatusChange(app._id, st)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  app.status === st
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
