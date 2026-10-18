import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [remoteOnly, setRemoteOnly] = useState(searchParams.get('remote') === 'true');
  const [matchesMap, setMatchesMap] = useState({});

  // Fetch opportunities with active filters
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedType) params.append('type', selectedType);
      if (selectedLevel) params.append('level', selectedLevel);
      if (remoteOnly) params.append('remote', 'true');
      params.append('status', 'open');

      const res = await api.get(`/opportunities?${params.toString()}`);
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  // If user is seeker, fetch smart matches to overlay match badges on cards
  useEffect(() => {
    async function fetchMatches() {
      if (user?.role === 'seeker') {
        try {
          const res = await api.get('/matches');
          if (res.data.success && res.data.matches) {
            const map = {};
            res.data.matches.forEach((m) => {
              map[m._id] = m.score;
            });
            setMatchesMap(map);
          }
        } catch (err) {
          console.warn('Could not load smart matches:', err);
        }
      }
    }
    fetchMatches();
  }, [user]);

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType, selectedLevel, remoteOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedLevel('');
    setRemoteOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Opportunities</h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore full-time jobs, internships, and early startup projects tailored to your skills.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by role, keyword, or required skill (e.g. React, Python, UI/UX)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            {['', 'job', 'internship', 'project'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg border font-medium capitalize transition-all ${
                  selectedType === type
                    ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type || 'All Types'}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Level Filter */}
          <div className="flex items-center gap-1">
            {['', 'Student', 'Fresher', 'Junior', 'Mid'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lvl || 'All Levels'}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Remote Toggle */}
          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
              remoteOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remote Only
          </button>

          {(selectedType || selectedLevel || remoteOnly || searchQuery) && (
            <button
              onClick={clearFilters}
              className="ml-auto text-slate-400 hover:text-rose-600 flex items-center gap-1 text-xs font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <LoadingSpinner text="Searching opportunities..." />
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No opportunities matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting search terms, clearing selected filters, or checking back soon.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const matchScore = matchesMap[opp._id];
            return (
              <div
                key={opp._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Type & Remote & Match Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {opp.type}
                      </span>
                      {opp.remote && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Remote
                        </span>
                      )}
                    </div>
                    {matchScore !== undefined && (
                      <MatchBadge score={matchScore} size="sm" />
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1 leading-snug">
                    {opp.title}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 mb-3">
                    {opp.owner?.startupProfile?.startupName || opp.owner?.recruiterProfile?.companyName || opp.owner?.name}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Required Skills */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {opp.requiredSkills.slice(0, 4).map((s) => (
                        <SkillTag key={s} skill={s} />
                      ))}
                      {opp.requiredSkills.length > 4 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{opp.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{opp.location || 'Remote'}</span>
                  </div>

                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
