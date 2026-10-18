import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import StatusChip from '../components/StatusChip';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  BookOpen,
  Send,
  AlertCircle,
  Check,
  Building,
  ArrowLeft,
  X
} from 'lucide-react';

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Fetch opportunity details
      const res = await api.get(`/opportunities/${id}`);
      if (res.data.success) {
        setOpportunity(res.data.opportunity);
      }

      // 2. If seeker, fetch skill-gap & score
      if (user?.role === 'seeker') {
        try {
          const gapRes = await api.get(`/skill-gap/${id}`);
          if (gapRes.data.success) {
            setSkillGapData(gapRes.data);
          }
        } catch (err) {
          console.warn('Could not compute skill gap:', err);
        }

        // 3. Check if applicant already applied
        try {
          const appRes = await api.get('/applications/mine');
          if (appRes.data.success) {
            const found = appRes.data.applications.find(
              (a) => a.opportunity?._id === id || a.opportunity === id
            );
            if (found) {
              setMyApplication(found);
            }
          }
        } catch (err) {
          console.warn('Could not check existing applications:', err);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load opportunity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmittingApply(true);
    setError('');

    try {
      const res = await api.post('/applications', {
        opportunityId: id,
        coverNote
      });

      if (res.data.success) {
        setApplySuccess(true);
        setMyApplication(res.data.application);
        setApplyModalOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Application failed');
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleCloseOpportunity = async () => {
    if (!window.confirm('Are you sure you want to close this opportunity for applications?')) return;
    try {
      await api.patch(`/opportunities/${id}/close`);
      loadData();
    } catch (err) {
      alert('Failed to close opportunity: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading opportunity..." />;
  }

  if (error && !opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const isOwner = user?._id && opportunity?.owner?._id && user._id === opportunity.owner._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all opportunities</span>
      </Link>

      {/* Main Role Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {opportunity.type}
              </span>
              {opportunity.remote && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                  Remote
                </span>
              )}
              {opportunity.status === 'closed' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200">
                  Closed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {opportunity.title}
            </h1>

            <p className="text-sm font-semibold text-teal-700">
              {opportunity.owner?.startupProfile?.startupName ||
                opportunity.owner?.recruiterProfile?.companyName ||
                opportunity.owner?.name}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            {isOwner ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/my-opportunities"
                  className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700"
                >
                  View Applicants
                </Link>
                {opportunity.status === 'open' && (
                  <button
                    onClick={handleCloseOpportunity}
                    className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50"
                  >
                    Close Position
                  </button>
                )}
              </div>
            ) : user?.role === 'seeker' ? (
              myApplication ? (
                <div className="text-right p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Application Status:
                  </span>
                  <StatusChip status={myApplication.status} />
                </div>
              ) : opportunity.status === 'open' ? (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-md shadow-teal-600/25 hover:bg-teal-700 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-xl">
                  Position Closed
                </span>
              )
            ) : (
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm hover:bg-teal-700"
              >
                Sign up as Seeker to Apply
              </Link>
            )}
          </div>
        </div>

        {/* Key Attributes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block">Location</span>
            <span className="font-bold text-slate-800">{opportunity.location || 'Remote'}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block">Target Seniority</span>
            <span className="font-bold text-slate-800">
              {opportunity.levels?.join(', ') || 'Any Experience'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block">Deadline</span>
            <span className="font-bold text-slate-800">
              {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Rolling Basis'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block">Posted</span>
            <span className="font-bold text-slate-800">
              {new Date(opportunity.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Seeker Match & Skill-Gap Analysis Card */}
      {user?.role === 'seeker' && skillGapData && (
        <div className="bg-gradient-to-br from-teal-50/80 via-white to-amber-50/50 rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Smart Skill-Gap & Match Analysis</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Your Fit Breakdown</h2>
              <p className="text-xs text-slate-600 mt-0.5">{skillGapData.reason}</p>
            </div>
            <MatchBadge score={skillGapData.score} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-4 bg-white rounded-2xl border border-teal-100 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block mb-2 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span>Matched Skills ({skillGapData.matched?.length || 0})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillGapData.matched?.length > 0 ? (
                  skillGapData.matched.map((s) => (
                    <SkillTag key={s} skill={s} variant="matched" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400">None of your listed skills match this role</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 bg-white rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block mb-2 flex items-center gap-1">
                <X className="w-3.5 h-3.5 text-rose-500" />
                <span>Missing Required Skills ({skillGapData.missing?.length || 0})</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillGapData.missing?.length > 0 ? (
                  skillGapData.missing.map((s) => (
                    <SkillTag key={s} skill={s} variant="missing" />
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-bold">
                    You have all required skills for this role! 🎉
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skill-Gap Tips with Curated Learning Links */}
          {skillGapData.missingSkillsWithLinks?.length > 0 && (
            <div className="pt-4 border-t border-teal-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Skill-Gap Tips: Bridge Missing Skills with Curated Courses & Docs</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillGapData.missingSkillsWithLinks.map((skillItem) => (
                  <div
                    key={skillItem.name}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{skillItem.name}</span>
                      <span className="text-[10px] text-slate-400">{skillItem.category}</span>
                    </div>
                    <div className="space-y-1">
                      {skillItem.learningLinks?.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-[11px] text-teal-700 hover:text-teal-900 hover:underline p-1 rounded bg-teal-50/50"
                        >
                          <span className="truncate pr-2">{link.title}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Description & Skill Tags */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">About the Opportunity</h2>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </div>
        </div>

        {/* Required Skills */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
        </div>

        {/* Nice to Have Skills */}
        {opportunity.niceToHave && opportunity.niceToHave.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Nice-to-Have Bonus Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.niceToHave.map((s) => (
                <SkillTag key={s} skill={s} variant="accent" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                Apply to {opportunity.title}
              </h3>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Your profile skills, education, and portfolio links will automatically be attached to your application.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself, why you're interested, and how your skills align..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApply}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {submittingApply ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
