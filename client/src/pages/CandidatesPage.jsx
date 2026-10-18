import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Search,
  Star,
  ExternalLink,
  Briefcase,
  CheckCircle,
  Sparkles,
  MapPin,
  GraduationCap
} from 'lucide-react';

export default function CandidatesPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'shortlist'
  const [candidates, setCandidates] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [shortlistingId, setShortlistingId] = useState(null);

  // 1. Fetch poster's opportunities
  useEffect(() => {
    async function fetchOpps() {
      try {
        const res = await api.get('/opportunities/mine');
        if (res.data.success) {
          setMyOpportunities(res.data.opportunities);
          if (res.data.opportunities.length > 0) {
            setSelectedOppId(res.data.opportunities[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching postings:', err);
      }
    }
    fetchOpps();
  }, []);

  // 2. Fetch candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedOppId) params.append('opportunityId', selectedOppId);
      if (selectedLevel) params.append('level', selectedLevel);
      if (searchSkill) params.append('skills', searchSkill);

      const res = await api.get(`/candidates?${params.toString()}`);
      if (res.data.success) {
        setCandidates(res.data.candidates);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch shortlist
  const fetchShortlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/candidates/shortlist');
      if (res.data.success) {
        setShortlist(res.data.shortlist);
      }
    } catch (err) {
      console.error('Error fetching shortlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'search') {
      fetchCandidates();
    } else {
      fetchShortlist();
    }
  }, [selectedOppId, selectedLevel, activeTab]);

  const handleShortlist = async (candidateId) => {
    setShortlistingId(candidateId);
    try {
      await api.post('/candidates/shortlist', {
        candidateId,
        opportunityId: selectedOppId || null
      });
      alert('Candidate added to your shortlist!');
    } catch (err) {
      alert(err.message || 'Already shortlisted or failed');
    } finally {
      setShortlistingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-teal-600" />
            <span>Candidate Sourcing & Ranking</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Score and rank qualified seekers against your active positions with SkillSpark's 70/20/10 engine.
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rank Candidates
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'shortlist' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Shortlist
          </button>
        </div>
      </div>

      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Score & Rank Candidates Against Opening:
              </label>
              <select
                value={selectedOppId}
                onChange={(e) => setSelectedOppId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none min-w-[280px]"
              >
                <option value="">General Ranking (All Seekers)</option>
                {myOpportunities.map((opp) => (
                  <option key={opp._id} value={opp._id}>
                    {opp.title} ({opp.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Level:</span>
              {['', 'Student', 'Fresher', 'Junior', 'Mid'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedLevel === lvl
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl || 'All'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Ranking candidates..." />
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No candidates matched</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((cand) => (
                <div
                  key={cand._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{cand.name}</h3>
                        <p className="text-xs text-slate-500 capitalize">
                          {cand.seekerProfile?.experienceLevel || 'Candidate'}
                          {cand.seekerProfile?.education?.college ? ` • ${cand.seekerProfile.education.college}` : ''}
                        </p>
                      </div>
                      <MatchBadge score={cand.score} size="md" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 my-3">
                      {cand.seekerProfile?.bio || 'Ready for full-stack opportunities.'}
                    </p>

                    {cand.reason && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-3">
                        <span className="font-semibold text-teal-800 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{cand.reason}</span>
                        </span>
                      </div>
                    )}

                    {cand.seekerProfile?.skills?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {cand.seekerProfile.skills.slice(0, 5).map((s) => (
                            <SkillTag key={s} skill={s} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {cand.seekerProfile?.availability || 'Available'}
                    </span>
                    <button
                      onClick={() => handleShortlist(cand._id)}
                      disabled={shortlistingId === cand._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{shortlistingId === cand._id ? 'Saving...' : 'Shortlist'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Shortlist Tab */}
      {activeTab === 'shortlist' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">My Shortlisted Talent</h2>

          {shortlist.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No candidates in your shortlist yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {shortlist.map((item) => (
                <div key={item._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.candidate?.name}</h4>
                    <p className="text-xs text-slate-500">
                      {item.candidate?.email} • {item.candidate?.seekerProfile?.experienceLevel}
                    </p>
                    {item.opportunity && (
                      <p className="text-xs text-teal-700 font-semibold mt-1">
                        Shortlisted for: {item.opportunity.title}
                      </p>
                    )}
                    {item.candidate?.seekerProfile?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.candidate.seekerProfile.skills.slice(0, 5).map((s) => (
                          <SkillTag key={s} skill={s} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-400">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
