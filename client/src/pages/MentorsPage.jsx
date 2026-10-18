import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import StatusChip from '../components/StatusChip';
import SkillTag from '../components/SkillTag';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Compass,
  Search,
  ExternalLink,
  Send,
  Sparkles,
  Linkedin,
  Clock,
  CheckCircle,
  X,
  MessageSquare
} from 'lucide-react';

export default function MentorsPage() {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my-requests'
  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  // Request modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedExpertise) params.append('expertise', selectedExpertise);

      const res = await api.get(`/mentors?${params.toString()}`);
      if (res.data.success) {
        setMentors(res.data.mentors);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/mentors/mentor-requests/mine');
      if (res.data.success) {
        setMyRequests(res.data.requests);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchMentors();
    } else {
      fetchMyRequests();
    }
  }, [activeTab, selectedExpertise]);

  const handleOpenRequest = (mentor) => {
    if (!isAuthenticated) {
      alert('Please log in to request mentorship');
      return;
    }
    setSelectedMentor(mentor);
    setRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/mentors/mentor-requests', {
        mentorId: selectedMentor._id,
        message
      });

      if (res.data.success) {
        alert('Mentorship request sent successfully!');
        setRequestModalOpen(false);
        setMessage('');
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await api.patch(`/mentors/mentor-requests/${requestId}`, { status });
      fetchMyRequests();
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-8 h-8 text-teal-600" />
            <span>Mentor Connect</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect with seasoned engineering leaders, venture-backed founders, and design specialists for 1-on-1 guidance.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'browse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Browse Mentors
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              My Mentorships
            </button>
          </div>
        )}
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search & Expertise filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search mentors by name, role, or expertise (e.g. React, Fundraising, UI/UX)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMentors()}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['', 'React', 'Python', 'UI/UX', 'Fundraising', 'Machine Learning'].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExpertise(exp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedExpertise === exp
                      ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {exp || 'All Expertise'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading mentors..." />
          ) : mentors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No mentors found for this filter</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m) => (
                <div
                  key={m._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-amber-500 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{m.name}</h3>
                          <p className="text-xs font-semibold text-teal-700">
                            {m.mentorProfile?.currentRole || 'Industry Mentor'}
                          </p>
                        </div>
                      </div>
                      {m.mentorProfile?.linkedin && (
                        <a
                          href={m.mentorProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 p-1"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 my-3 leading-relaxed">
                      {m.mentorProfile?.bio}
                    </p>

                    <div className="space-y-1.5 text-xs mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-400">Experience:</span>
                        <span className="font-bold text-slate-800">{m.mentorProfile?.yearsOfExperience} years</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-400">Availability:</span>
                        <span className="font-bold text-slate-800">{m.mentorProfile?.weeklyAvailability || '1-2 hrs/wk'}</span>
                      </div>
                    </div>

                    {/* Expertise Areas */}
                    {m.mentorProfile?.expertiseAreas?.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Expertise Areas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {m.mentorProfile.expertiseAreas.map((exp) => (
                            <SkillTag key={exp} skill={exp} variant="primary" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenRequest(m)}
                      className="w-full text-center py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm transition-colors"
                    >
                      Request Mentorship
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Mentorships Tab */}
      {activeTab === 'my-requests' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Mentorship Connections & Inquiries</h2>

          {myRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No mentorship requests found.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {myRequests.map((req) => {
                const isMentor = user?.role === 'mentor';
                const otherParty = isMentor ? req.mentee : req.mentor;

                return (
                  <div key={req._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {isMentor ? `Mentee: ${otherParty?.name}` : `Mentor: ${otherParty?.name}`}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{otherParty?.email}</p>
                      <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{req.message}"
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusChip status={req.status} />

                      {isMentor && req.status === 'pending' && (
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

      {/* Request Modal */}
      {requestModalOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">
                Connect with {selectedMentor.name}
              </h3>
              <button onClick={() => setRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Briefly describe your goals, background, and what specific advice or feedback you are seeking.
            </p>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Introduction *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Hello, I am seeking guidance on..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
