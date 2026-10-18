import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import StatusChip from '../components/StatusChip';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Search,
  Send,
  Sparkles,
  CheckCircle,
  XCircle,
  Briefcase,
  Lightbulb,
  X,
  Mail
} from 'lucide-react';

export default function PeopleFinderPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'requests'
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(searchParams.get('ideaId') || '');
  const [people, setPeople] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite modal state
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [inviteRole, setInviteRole] = useState('Co-Founder / Contributor');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // 1. Fetch available ideas for ranking
  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await api.get('/ideas');
        if (res.data.success) {
          setIdeas(res.data.ideas);
          if (!selectedIdeaId && res.data.ideas.length > 0) {
            setSelectedIdeaId(res.data.ideas[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching ideas:', err);
      }
    }
    fetchIdeas();
  }, []);

  // 2. Fetch ranked people
  const fetchRankedPeople = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedIdeaId) params.append('ideaId', selectedIdeaId);

      const res = await api.get(`/team/people?${params.toString()}`);
      if (res.data.success) {
        setPeople(res.data.people);
      }
    } catch (err) {
      console.error('Error fetching ranked people:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch team requests
  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/team/requests/mine');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching team requests:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'find') {
      fetchRankedPeople();
    } else {
      fetchMyRequests();
    }
  }, [selectedIdeaId, activeTab]);

  const handleOpenInvite = (person) => {
    setSelectedPerson(person);
    setInviteModalOpen(true);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedIdeaId) {
      alert('Please select an idea first to associate with this team invite');
      return;
    }

    setSubmittingInvite(true);
    try {
      const res = await api.post('/team/requests', {
        ideaId: selectedIdeaId,
        userId: selectedPerson._id,
        role: inviteRole
      });

      if (res.data.success) {
        alert('Invitation sent successfully!');
        setInviteModalOpen(false);
        setInviteRole('Co-Founder / Contributor');
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await api.patch(`/team/requests/${requestId}`, { status });
      fetchMyRequests();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const selectedIdea = ideas.find((i) => i._id === selectedIdeaId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-teal-600" />
            <span>Co-Founder & Team Finder</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rank potential collaborators against your venture's required skills using smart multi-factor matching.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'find'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Find & Rank People
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Team Requests
          </button>
        </div>
      </div>

      {activeTab === 'find' && (
        <div className="space-y-6">
          {/* Idea selector bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Rank People for Startup Idea:
                </label>
                <select
                  value={selectedIdeaId}
                  onChange={(e) => {
                    setSelectedIdeaId(e.target.value);
                    setSearchParams({ ideaId: e.target.value });
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none min-w-[280px]"
                >
                  {ideas.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.title} ({i.stage})
                    </option>
                  ))}
                </select>
              </div>

              {selectedIdea && selectedIdea.skillsNeeded?.length > 0 && (
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Skills Needed by Idea:
                  </span>
                  <div className="flex flex-wrap gap-1 sm:justify-end">
                    {selectedIdea.skillsNeeded.map((s) => (
                      <SkillTag key={s} skill={s} variant="primary" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ranked Candidates */}
          {loading ? (
            <LoadingSpinner text="Scoring people against idea requirements..." />
          ) : people.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No candidates available to rank</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {people.map((person) => (
                <div
                  key={person._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{person.name}</h3>
                        <p className="text-xs text-slate-500 capitalize">
                          {person.seekerProfile?.experienceLevel || person.role}
                          {person.seekerProfile?.education?.college ? ` • ${person.seekerProfile.education.college}` : ''}
                        </p>
                      </div>
                      <MatchBadge score={person.score} size="md" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 my-3">
                      {person.seekerProfile?.bio || 'Ready to contribute to startup ventures.'}
                    </p>

                    {/* Matched skills */}
                    {person.matched && person.matched.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
                          Matched Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {person.matched.map((s) => (
                            <SkillTag key={s} skill={s} variant="matched" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All skills */}
                    {person.seekerProfile?.skills?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          All Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {person.seekerProfile.skills.slice(0, 4).map((s) => (
                            <SkillTag key={s} skill={s} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {person.seekerProfile?.availability || 'Available'}
                    </span>
                    <button
                      onClick={() => handleOpenInvite(person)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Team Request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Team Collaboration Inquiries</h2>

          {requests.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No team requests found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {requests.map((req) => {
                const isRecipient = req.user?._id === user?._id;
                const isOwner = req.idea?.owner === user?._id;

                return (
                  <div key={req._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {req.idea?.title}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800">
                          Role: {req.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {isRecipient ? `Invited by Idea Owner` : `Invited user: ${req.user?.name} (${req.user?.email})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusChip status={req.status} />

                      {req.status === 'pending' && (isRecipient || isOwner) && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'accepted')}
                            className="px-3 py-1 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'declined')}
                            className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalOpen && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                Invite {selectedPerson.name} to Team
              </h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              For startup project: <span className="font-bold text-slate-800">{selectedIdea?.title}</span>
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Role / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Co-Founder & Frontend Lead"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {submittingInvite ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
