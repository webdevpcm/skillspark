import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Lightbulb,
  PlusCircle,
  ThumbsUp,
  Users,
  Search,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function IdeaBoardPage() {
  const { user, isAuthenticated } = useAuth();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [postModalOpen, setPostModalOpen] = useState(false);

  // New Idea state
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newSkillsNeeded, setNewSkillsNeeded] = useState([]);
  const [newStage, setNewStage] = useState('Idea');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedStage) params.append('stage', selectedStage);

      const res = await api.get(`/ideas?${params.toString()}`);
      if (res.data.success) {
        setIdeas(res.data.ideas);
      }
    } catch (err) {
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [selectedStage]);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await api.get('/skills');
        if (res.data.success) setAvailableSkills(res.data.skills);
      } catch (err) {
        console.error('Error loading skills:', err);
      }
    }
    loadSkills();
  }, []);

  const handleToggleInterest = async (ideaId) => {
    if (!isAuthenticated) {
      alert('Please log in to express interest in ideas');
      return;
    }
    try {
      await api.post(`/ideas/${ideaId}/interest`);
      fetchIdeas();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleSkillToggle = (skill) => {
    if (newSkillsNeeded.includes(skill)) {
      setNewSkillsNeeded(newSkillsNeeded.filter((s) => s !== skill));
    } else {
      setNewSkillsNeeded([...newSkillsNeeded, skill]);
    }
  };

  const handlePostIdea = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/ideas', {
        title: newTitle,
        problem: newProblem,
        solution: newSolution,
        skillsNeeded: newSkillsNeeded,
        stage: newStage
      });

      if (res.data.success) {
        setPostModalOpen(false);
        setNewTitle('');
        setNewProblem('');
        setNewSolution('');
        setNewSkillsNeeded([]);
        fetchIdeas();
      }
    } catch (err) {
      alert('Failed to post idea: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-amber-500" />
            <span>Startup Idea & Project Board</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse early-stage concepts, signal interest to collaborate, or pitch your own venture to find team members.
          </p>
        </div>

        {isAuthenticated && (user?.role === 'startup' || user?.role === 'seeker') && (
          <button
            onClick={() => setPostModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Idea</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search ideas by title, problem, or needed skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchIdeas()}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['', 'Idea', 'Building', 'Launched'].map((stg) => (
            <button
              key={stg}
              onClick={() => setSelectedStage(stg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedStage === stg
                  ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {stg || 'All Stages'}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      {loading ? (
        <LoadingSpinner text="Loading ideas..." />
      ) : ideas.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No startup ideas found</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to post a new venture concept!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => {
            const isInterested = user && idea.interested?.some((u) => (u._id || u) === user._id);
            const isOwner = user && idea.owner?._id === user._id;

            return (
              <div
                key={idea._id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                      {idea.stage} Stage
                    </span>
                    <span className="text-[11px] text-slate-400">
                      by {idea.owner?.name}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                    {idea.title}
                  </h3>

                  <div className="space-y-2 text-xs mb-4">
                    <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100">
                      <span className="font-bold text-rose-800 block text-[10px] uppercase tracking-wider mb-0.5">
                        Problem:
                      </span>
                      <p className="text-slate-700 line-clamp-2">{idea.problem}</p>
                    </div>

                    <div className="p-2.5 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="font-bold text-teal-800 block text-[10px] uppercase tracking-wider mb-0.5">
                        Solution:
                      </span>
                      <p className="text-slate-700 line-clamp-2">{idea.solution}</p>
                    </div>
                  </div>

                  {idea.skillsNeeded && idea.skillsNeeded.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Skills Needed:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {idea.skillsNeeded.map((s) => (
                          <SkillTag key={s} skill={s} variant="primary" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleInterest(idea._id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isInterested
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isInterested ? 'fill-white' : ''}`} />
                    <span>{idea.interested?.length || 0} Interested</span>
                  </button>

                  <Link
                    to={`/people-finder?ideaId=${idea._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <span>Rank Team</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Idea Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Post a Startup Idea</h3>
              <button onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostIdea} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Idea Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Assisted Medical Screenings"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Problem Statement *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What is the core problem and who suffers from it?"
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Solution *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="How does your platform solve this problem uniquely?"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Stage
                </label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none"
                >
                  <option value="Idea">Idea</option>
                  <option value="Building">Building</option>
                  <option value="Launched">Launched</option>
                </select>
              </div>

              {/* Skills Needed */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skills Needed For Co-Founders / Contributors
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 p-2 bg-slate-50 rounded-xl border border-slate-200 min-h-[38px]">
                  {newSkillsNeeded.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      variant="primary"
                      onRemove={(sk) => setNewSkillsNeeded(newSkillsNeeded.filter((i) => i !== sk))}
                    />
                  ))}
                </div>
                <div className="max-h-28 overflow-y-auto p-2 border border-slate-200 rounded-xl flex flex-wrap gap-1 bg-white">
                  {availableSkills.slice(0, 30).map((sk) => (
                    <button
                      key={sk.name}
                      type="button"
                      onClick={() => handleSkillToggle(sk.name)}
                      className={`text-[11px] px-2 py-0.5 rounded border ${
                        newSkillsNeeded.includes(sk.name)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {sk.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Idea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
