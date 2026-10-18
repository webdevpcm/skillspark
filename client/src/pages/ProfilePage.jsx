import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import SkillTag from '../components/SkillTag';
import {
  User,
  Mail,
  CheckCircle,
  AlertCircle,
  Save,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Briefcase
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');

  // Seeker State
  const [seekerSkills, setSeekerSkills] = useState(user?.seekerProfile?.skills || []);
  const [seekerInterests, setSeekerInterests] = useState(user?.seekerProfile?.interests || []);
  const [seekerLevel, setSeekerLevel] = useState(user?.seekerProfile?.experienceLevel || 'Fresher');
  const [seekerAvailability, setSeekerAvailability] = useState(user?.seekerProfile?.availability || 'full-time');
  const [seekerEducation, setSeekerEducation] = useState(user?.seekerProfile?.education || { college: '', course: '', year: '' });
  const [seekerLocation, setSeekerLocation] = useState(user?.seekerProfile?.location || '');
  const [seekerRemote, setSeekerRemote] = useState(user?.seekerProfile?.remotePreference ?? true);
  const [seekerPortfolios, setSeekerPortfolios] = useState(user?.seekerProfile?.portfolioLinks || { github: '', linkedin: '', projects: '' });
  const [seekerBio, setSeekerBio] = useState(user?.seekerProfile?.bio || '');

  // Entrepreneur State
  const [ventureName, setVentureName] = useState(user?.entrepreneurProfile?.ventureName || '');
  const [ventureTagline, setVentureTagline] = useState(user?.entrepreneurProfile?.tagline || '');
  const [ventureProblem, setVentureProblem] = useState(user?.entrepreneurProfile?.problem || '');
  const [ventureStage, setVentureStage] = useState(user?.entrepreneurProfile?.stage || 'Idea');
  const [ventureIndustry, setVentureIndustry] = useState(user?.entrepreneurProfile?.industry || '');
  const [ventureLookingFor, setVentureLookingFor] = useState(user?.entrepreneurProfile?.lookingFor || []);
  const [ventureSkillsNeeded, setVentureSkillsNeeded] = useState(user?.entrepreneurProfile?.skillsNeeded || []);
  const [ventureLocation, setVentureLocation] = useState(user?.entrepreneurProfile?.location || '');
  const [ventureRemote, setVentureRemote] = useState(user?.entrepreneurProfile?.remote ?? true);
  const [pitchDeckUrl, setPitchDeckUrl] = useState(user?.entrepreneurProfile?.pitchDeckUrl || '');
  const [ventureBio, setVentureBio] = useState(user?.entrepreneurProfile?.bio || '');

  // Startup State
  const [startupName, setStartupName] = useState(user?.startupProfile?.startupName || '');
  const [startupDesc, setStartupDesc] = useState(user?.startupProfile?.description || '');
  const [startupStage, setStartupStage] = useState(user?.startupProfile?.stage || 'Building');
  const [startupDomain, setStartupDomain] = useState(user?.startupProfile?.domain || '');
  const [startupSkillsNeeded, setStartupSkillsNeeded] = useState(user?.startupProfile?.skillsNeeded || []);
  const [startupLocation, setStartupLocation] = useState(user?.startupProfile?.location || '');
  const [startupRemote, setStartupRemote] = useState(user?.startupProfile?.remote ?? true);
  const [startupWebsite, setStartupWebsite] = useState(user?.startupProfile?.website || '');

  // Mentor State
  const [mentorExpertise, setMentorExpertise] = useState(user?.mentorProfile?.expertiseAreas || []);
  const [mentorYears, setMentorYears] = useState(user?.mentorProfile?.yearsOfExperience || 0);
  const [mentorExpType, setMentorExpType] = useState(user?.mentorProfile?.experienceType || '');
  const [mentorRole, setMentorRole] = useState(user?.mentorProfile?.currentRole || '');
  const [mentorAvailability, setMentorAvailability] = useState(user?.mentorProfile?.weeklyAvailability || '');
  const [mentorPreferences, setMentorPreferences] = useState(user?.mentorProfile?.menteePreference || []);
  const [mentorLinkedin, setMentorLinkedin] = useState(user?.mentorProfile?.linkedin || '');
  const [mentorBio, setMentorBio] = useState(user?.mentorProfile?.bio || '');

  // Recruiter State
  const [recruiterCompany, setRecruiterCompany] = useState(user?.recruiterProfile?.companyName || '');
  const [recruiterWebsite, setRecruiterWebsite] = useState(user?.recruiterProfile?.companyWebsite || '');
  const [recruiterPosition, setRecruiterPosition] = useState(user?.recruiterProfile?.position || '');
  const [recruiterHiringAreas, setRecruiterHiringAreas] = useState(user?.recruiterProfile?.hiringAreas || []);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await api.get('/skills');
        if (res.data.success) {
          setAvailableSkills(res.data.skills);
        }
      } catch (err) {
        console.error('Error loading skills:', err);
      }
    }
    loadSkills();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = { name };
      if (user?.role === 'seeker') {
        payload.seekerProfile = {
          skills: seekerSkills,
          interests: seekerInterests,
          education: seekerEducation,
          experienceLevel: seekerLevel,
          availability: seekerAvailability,
          location: seekerLocation,
          remotePreference: seekerRemote,
          portfolioLinks: seekerPortfolios,
          bio: seekerBio
        };
      } else if (user?.role === 'entrepreneur') {
        payload.entrepreneurProfile = {
          ventureName,
          tagline: ventureTagline,
          problem: ventureProblem,
          stage: ventureStage,
          industry: ventureIndustry,
          lookingFor: ventureLookingFor,
          skillsNeeded: ventureSkillsNeeded,
          location: ventureLocation,
          remote: ventureRemote,
          pitchDeckUrl,
          bio: ventureBio
        };
      } else if (user?.role === 'startup') {
        payload.startupProfile = {
          startupName,
          description: startupDesc,
          stage: startupStage,
          domain: startupDomain,
          skillsNeeded: startupSkillsNeeded,
          location: startupLocation,
          remote: startupRemote,
          website: startupWebsite
        };
      } else if (user?.role === 'mentor') {
        payload.mentorProfile = {
          expertiseAreas: mentorExpertise,
          yearsOfExperience: Number(mentorYears) || 0,
          experienceType: mentorExpType,
          currentRole: mentorRole,
          weeklyAvailability: mentorAvailability,
          menteePreference: mentorPreferences,
          linkedin: mentorLinkedin,
          bio: mentorBio
        };
      } else if (user?.role === 'recruiter') {
        payload.recruiterProfile = {
          companyName: recruiterCompany,
          companyWebsite: recruiterWebsite,
          position: recruiterPosition,
          hiringAreas: recruiterHiringAreas
        };
      }

      await updateUserProfile(payload);
      setSuccess('Profile updated successfully and completion recomputed!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skillName, list, setter) => {
    if (list.includes(skillName)) {
      setter(list.filter((s) => s !== skillName));
    } else {
      setter([...list, skillName]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
            {user?.role} Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{user?.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[200px] text-right">
          <span className="text-xs font-semibold text-slate-500 block">Profile Completion</span>
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-2xl font-black text-teal-600">{user?.profileCompletion || 0}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-teal-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${user?.profileCompletion || 0}%` }}
            />
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Seeker Profile fields */}
        {user?.role === 'seeker' && (
          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">My Skills</label>
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
                {seekerSkills.map((s) => (
                  <SkillTag
                    key={s}
                    skill={s}
                    variant="primary"
                    onRemove={(sk) => setSeekerSkills(seekerSkills.filter((i) => i !== sk))}
                  />
                ))}
              </div>
              <input
                type="text"
                placeholder="Search skills to add..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 mb-2 focus:outline-none"
              />
              <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
                {availableSkills
                  .filter((s) => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
                  .slice(0, 30)
                  .map((sk) => (
                    <button
                      key={sk.name}
                      type="button"
                      onClick={() => handleSkillToggle(sk.name, seekerSkills, setSeekerSkills)}
                      className={`text-xs px-2.5 py-1 rounded-md border ${
                        seekerSkills.includes(sk.name)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {sk.name}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <select
                  value={seekerLevel}
                  onChange={(e) => setSeekerLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Student">Student</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Availability
                </label>
                <select
                  value={seekerAvailability}
                  onChange={(e) => setSeekerAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio
              </label>
              <textarea
                rows={3}
                value={seekerBio}
                onChange={(e) => setSeekerBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Entrepreneur Profile fields */}
        {user?.role === 'entrepreneur' && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venture / Project Name
                </label>
                <input
                  type="text"
                  value={ventureName}
                  onChange={(e) => setVentureName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={ventureIndustry}
                  onChange={(e) => setVentureIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                One-line Tagline
              </label>
              <input
                type="text"
                value={ventureTagline}
                onChange={(e) => setVentureTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Core Problem & Solution
              </label>
              <textarea
                rows={3}
                value={ventureProblem}
                onChange={(e) => setVentureProblem(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venture Stage
                </label>
                <select
                  value={ventureStage}
                  onChange={(e) => setVentureStage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Idea">Idea</option>
                  <option value="Building">Building</option>
                  <option value="MVP">MVP</option>
                  <option value="Launched">Launched</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pitch Deck / Demo Link
                </label>
                <input
                  type="url"
                  value={pitchDeckUrl}
                  onChange={(e) => setPitchDeckUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={ventureLocation}
                  onChange={(e) => setVentureLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="sm:pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ventureRemote}
                    onChange={(e) => setVentureRemote(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">Open to remote co-founders & team</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Founder Bio & Vision
              </label>
              <textarea
                rows={3}
                value={ventureBio}
                onChange={(e) => setVentureBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Startup Profile fields */}
        {user?.role === 'startup' && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Startup Name
              </label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={startupDesc}
                onChange={(e) => setStartupDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        )}

        {/* Mentor Profile fields */}
        {user?.role === 'mentor' && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Role
              </label>
              <input
                type="text"
                value={mentorRole}
                onChange={(e) => setMentorRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Bio & Experience
              </label>
              <textarea
                rows={3}
                value={mentorBio}
                onChange={(e) => setMentorBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        )}

        {/* Recruiter Profile fields */}
        {user?.role === 'recruiter' && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={recruiterCompany}
                onChange={(e) => setRecruiterCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Position
              </label>
              <input
                type="text"
                value={recruiterPosition}
                onChange={(e) => setRecruiterPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 text-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
