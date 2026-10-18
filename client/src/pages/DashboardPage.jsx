import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import StatusChip from '../components/StatusChip';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Sparkles,
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Users,
  Compass,
  Star,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateMentorRequest = async (requestId, status) => {
    try {
      await api.patch(`/mentors/mentor-requests/${requestId}`, { status });
      fetchDashboard();
    } catch (err) {
      alert('Failed to update request: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const completion = data?.profileCompletion ?? user?.profileCompletion ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Profile Completion Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="capitalize">{user?.role} Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-teal-100 text-sm mt-1 max-w-xl">
              Track your applications, matches, and ecosystem connections in real-time.
            </p>
          </div>

          {/* Profile Completion Box */}
          <div className="bg-white/10 backdrop-blur border border-white/15 p-4 rounded-2xl min-w-[260px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-200">Profile Completion</span>
              <span className="text-lg font-black text-white">{completion}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            {completion < 100 ? (
              <Link
                to="/profile"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                <span>Complete missing details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <span className="text-xs text-teal-300 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>All core profile fields complete!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= SEEKER DASHBOARD ================= */}
      {user?.role === 'seeker' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Applied</span>
              <p className="text-2xl font-extrabold text-slate-900">{data?.stats?.totalApplications || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Submitted</span>
              <p className="text-2xl font-extrabold text-slate-600">{data?.stats?.submittedCount || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">In Review</span>
              <p className="text-2xl font-extrabold text-blue-600">{data?.stats?.reviewingCount || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Accepted</span>
              <p className="text-2xl font-extrabold text-teal-600">{data?.stats?.acceptedCount || 0}</p>
            </div>
          </div>

          {/* Smart Recommended Opportunities (with MatchBadge and Missing Skills) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>Recommended For You</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ranked by SkillSpark's 70/20/10 matching engine based on your profile skills
                </p>
              </div>
              <Link
                to="/opportunities"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View all opportunities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {(!data?.recommendations || data.recommendations.length === 0) ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No high-confidence matches found yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add more skills to your profile or explore all open opportunities to discover new roles.
                </p>
                <Link
                  to="/profile"
                  className="mt-4 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm"
                >
                  Update Skills in Profile
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.recommendations.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {job.type}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-1.5">{job.title}</h3>
                          <p className="text-xs text-slate-500">{job.owner?.name || 'Company'}</p>
                        </div>
                        <MatchBadge score={job.score} size="md" />
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 my-2.5">{job.description}</p>

                      {/* Reason & Missing Skills */}
                      <div className="space-y-1.5 text-xs mb-4 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 inline" />
                          <span>{job.reason}</span>
                        </p>
                        {job.missing && job.missing.length > 0 && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span className="font-medium text-amber-700">Missing:</span>
                            <span>{job.missing.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">{job.location || 'Remote'}</span>
                      <Link
                        to={`/opportunities/${job._id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                      >
                        <span>View & Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications Tracking */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Recent Applications</span>
              </h2>
              <Link
                to="/my-applications"
                className="text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                View all applications
              </Link>
            </div>

            {(!data?.recentApplications || data.recentApplications.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No applications submitted yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {data.recentApplications.map((app) => (
                  <div key={app._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.opportunity?.title}</h4>
                      <p className="text-xs text-slate-500">
                        {app.opportunity?.type} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusChip status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ENTREPRENEUR DASHBOARD ================= */}
      {user?.role === 'entrepreneur' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Active Ventures</span>
              <p className="text-2xl font-extrabold text-amber-600">{data?.stats?.activeVentures || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Interested Builders</span>
              <p className="text-2xl font-extrabold text-teal-600">{data?.stats?.interestedBuildersCount || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Team Requests</span>
              <p className="text-2xl font-extrabold text-blue-600">{data?.stats?.pendingTeamRequests || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Mentor Connections</span>
              <p className="text-2xl font-extrabold text-purple-600">{data?.stats?.mentorConnections || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Ideas / Ventures */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <span>My Pitches & Ideas</span>
                  </h3>
                  <p className="text-xs text-slate-500">Track builder interest and assemble your founding team</p>
                </div>
                <Link
                  to="/idea-board"
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post New Pitch</span>
                </Link>
              </div>

              {(!data?.myIdeas || data.myIdeas.length === 0) ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Lightbulb className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No startup ideas pitched yet</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Publish your venture problem and vision to the Idea Board to attract builders and co-founders.
                  </p>
                  <Link
                    to="/idea-board"
                    className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
                  >
                    Post an Idea Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.myIdeas.map((idea) => (
                    <div
                      key={idea._id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            {idea.stage || 'Idea'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{idea.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1">{idea.problem}</p>
                        <p className="text-[11px] text-teal-700 font-semibold mt-1">
                          ✨ {idea.interested?.length || 0} builders expressed interest
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          to={`/people-finder?ideaId=${idea._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-sm"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Find Team</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Ecosystem Launchpad */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider text-slate-500">
                  Founder Launchpad
                </h3>
                <div className="space-y-2.5">
                  <Link
                    to="/idea-board"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Pitch on Idea Board</p>
                        <p className="text-[10px] text-slate-500">Get early validation & feedback</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/people-finder"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Match Co-founders</p>
                        <p className="text-[10px] text-slate-500">Find complementary skillsets</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/mentors"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Connect with Mentors</p>
                        <p className="text-[10px] text-slate-500">Guidance on scale, tech & pitch</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/post-opportunity"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Post Project or Role</p>
                        <p className="text-[10px] text-slate-500">Hire student interns or builders</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Mentor Connection Status */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                    Mentorship Outreach
                  </h4>
                  <Link to="/mentors" className="text-xs font-semibold text-teal-600">Browse</Link>
                </div>

                {(!data?.mentorRequests || data.mentorRequests.length === 0) ? (
                  <p className="text-xs text-slate-400 text-center py-4">No mentor requests sent yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {data.mentorRequests.map((req) => (
                      <div key={req._id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{req.mentor?.name}</p>
                          <p className="text-[10px] text-slate-500">{req.mentor?.mentorProfile?.currentRole || 'Industry Mentor'}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          req.status === 'accepted' ? 'bg-teal-100 text-teal-800' :
                          req.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STARTUP DASHBOARD ================= */}
      {user?.role === 'startup' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Postings</span>
              <p className="text-2xl font-extrabold text-slate-900">{data?.stats?.postedOpportunities || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Applicants</span>
              <p className="text-2xl font-extrabold text-teal-600">{data?.stats?.totalApplicants || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Ideas</span>
              <p className="text-2xl font-extrabold text-amber-600">{data?.stats?.activeIdeas || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Team Requests</span>
              <p className="text-2xl font-extrabold text-blue-600">{data?.stats?.pendingTeamRequests || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Applicants */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Recent Applicants</h3>
                <Link to="/my-opportunities" className="text-xs font-semibold text-teal-600">Manage all</Link>
              </div>

              {(!data?.recentApplicants || data.recentApplicants.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">No applicants yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentApplicants.map((app) => (
                    <div key={app._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{app.applicant?.name}</p>
                        <p className="text-[11px] text-slate-500">{app.opportunity?.title}</p>
                      </div>
                      <StatusChip status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Ideas */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">My Startup Ideas</h3>
                <Link to="/idea-board" className="text-xs font-semibold text-teal-600">Post idea</Link>
              </div>

              {(!data?.myIdeas || data.myIdeas.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">No ideas published yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.myIdeas.map((idea) => (
                    <div key={idea._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{idea.title}</p>
                        <p className="text-[11px] text-teal-700 font-medium">{idea.interested?.length || 0} builders interested</p>
                      </div>
                      <Link
                        to={`/people-finder?ideaId=${idea._id}`}
                        className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-teal-400"
                      >
                        Find Team
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MENTOR DASHBOARD ================= */}
      {user?.role === 'mentor' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Mentee Requests</span>
              <p className="text-2xl font-extrabold text-slate-900">{data?.stats?.totalRequests || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Pending Inquiries</span>
              <p className="text-2xl font-extrabold text-amber-600">{data?.stats?.pendingRequestsCount || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Active Mentees</span>
              <p className="text-2xl font-extrabold text-teal-600">{data?.stats?.activeMenteesCount || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Pending Mentorship Inquiries</h3>
            {(!data?.pendingRequests || data.pendingRequests.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending requests right now.</p>
            ) : (
              <div className="space-y-4">
                {data.pendingRequests.map((req) => (
                  <div key={req._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.mentee?.name}</h4>
                      <p className="text-xs text-slate-500 capitalize">{req.mentee?.role} • {req.mentee?.email}</p>
                      <p className="text-xs text-slate-700 mt-2 bg-white p-2.5 rounded-lg border border-slate-100">
                        "{req.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleUpdateMentorRequest(req._id, 'accepted')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateMentorRequest(req._id, 'declined')}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= RECRUITER DASHBOARD ================= */}
      {user?.role === 'recruiter' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Active Job Postings</span>
              <p className="text-2xl font-extrabold text-slate-900">{data?.stats?.activeJobs || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Total Applicants</span>
              <p className="text-2xl font-extrabold text-teal-600">{data?.stats?.totalApplicants || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Shortlisted Talent</span>
              <p className="text-2xl font-extrabold text-amber-600">{data?.stats?.shortlistedCandidates || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Recent Applicants</h3>
                <Link to="/my-opportunities" className="text-xs font-semibold text-teal-600">Review all</Link>
              </div>
              {(!data?.recentApplicants || data.recentApplicants.length === 0) ? (
                <p className="text-xs text-slate-400 py-6 text-center">No applicants yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentApplicants.map((app) => (
                    <div key={app._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{app.applicant?.name}</p>
                        <p className="text-[11px] text-slate-500">{app.opportunity?.title}</p>
                      </div>
                      <StatusChip status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Candidate Search & Ranking</h3>
                <Link to="/candidates" className="text-xs font-semibold text-teal-600">Rank seekers</Link>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                SkillSpark allows recruiters to evaluate candidate talent against specific open opportunities using the 70/20/10 algorithm.
              </p>
              <Link
                to="/candidates"
                className="w-full text-center py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs inline-block"
              >
                Search & Rank Candidates
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
