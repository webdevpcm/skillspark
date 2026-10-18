import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import SkillTag from '../components/SkillTag';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Building,
  Compass,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  FolderGit2,
  Lightbulb
} from 'lucide-react';

export default function OnboardingPage() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Seeker State
  const [seekerSkills, setSeekerSkills] = useState(user?.seekerProfile?.skills || []);
  const [seekerInterests, setSeekerInterests] = useState(user?.seekerProfile?.interests || ['job']);
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
  const [ventureLookingFor, setVentureLookingFor] = useState(user?.entrepreneurProfile?.lookingFor || ['Co-founder', 'Early Developer']);
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
  const [mentorYears, setMentorYears] = useState(user?.mentorProfile?.yearsOfExperience || 5);
  const [mentorExpType, setMentorExpType] = useState(user?.mentorProfile?.experienceType || '');
  const [mentorRole, setMentorRole] = useState(user?.mentorProfile?.currentRole || '');
  const [mentorAvailability, setMentorAvailability] = useState(user?.mentorProfile?.weeklyAvailability || '2-3 hours/week');
  const [mentorPreferences, setMentorPreferences] = useState(user?.mentorProfile?.menteePreference || ['students', 'founders']);
  const [mentorLinkedin, setMentorLinkedin] = useState(user?.mentorProfile?.linkedin || '');
  const [mentorBio, setMentorBio] = useState(user?.mentorProfile?.bio || '');

  // Recruiter State
  const [recruiterCompany, setRecruiterCompany] = useState(user?.recruiterProfile?.companyName || '');
  const [recruiterWebsite, setRecruiterWebsite] = useState(user?.recruiterProfile?.companyWebsite || '');
  const [recruiterPosition, setRecruiterPosition] = useState(user?.recruiterProfile?.position || '');
  const [recruiterHiringAreas, setRecruiterHiringAreas] = useState(user?.recruiterProfile?.hiringAreas || ['Frontend Development', 'Backend Development']);

  // Fetch Skills
  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await api.get('/skills');
        if (res.data.success) {
          setAvailableSkills(res.data.skills);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    }
    fetchSkills();
  }, []);

  // Compute live estimated profile completion
  const computeLiveScore = () => {
    let score = 0;
    if (user?.role === 'seeker') {
      if (seekerSkills.length > 0) score += 20;
      if (seekerInterests.length > 0) score += 10;
      if (seekerEducation.college || seekerEducation.course) score += 15;
      if (seekerLevel) score += 15;
      if (seekerAvailability) score += 10;
      if (seekerLocation || seekerRemote !== undefined) score += 10;
      if (seekerPortfolios.github || seekerPortfolios.linkedin || seekerPortfolios.projects) score += 10;
      if (seekerBio.trim().length > 0) score += 10;
    } else if (user?.role === 'entrepreneur') {
      if (ventureName.trim().length > 0) score += 20;
      if (ventureProblem.trim().length > 0) score += 20;
      if (ventureStage) score += 15;
      if (ventureIndustry.trim().length > 0) score += 15;
      if (ventureSkillsNeeded.length > 0) score += 15;
      if (ventureLookingFor.length > 0) score += 5;
      if (ventureBio.trim().length > 0) score += 10;
    } else if (user?.role === 'startup') {
      if (startupName.trim().length > 0) score += 20;
      if (startupDesc.trim().length > 0) score += 20;
      if (startupStage) score += 15;
      if (startupDomain.trim().length > 0) score += 15;
      if (startupSkillsNeeded.length > 0) score += 15;
      if (startupLocation || startupRemote !== undefined) score += 5;
      if (startupWebsite.trim().length > 0) score += 10;
    } else if (user?.role === 'mentor') {
      if (mentorExpertise.length > 0) score += 25;
      if (mentorYears || mentorRole) score += 20;
      if (mentorAvailability) score += 15;
      if (mentorPreferences.length > 0) score += 15;
      if (mentorLinkedin.trim().length > 0) score += 10;
      if (mentorBio.trim().length > 0) score += 15;
    } else if (user?.role === 'recruiter') {
      if (recruiterCompany.trim().length > 0) score += 30;
      if (recruiterWebsite.trim().length > 0) score += 25;
      if (recruiterPosition.trim().length > 0) score += 25;
      if (recruiterHiringAreas.length > 0) score += 20;
    }
    return Math.min(score, 100);
  };

  const liveScore = computeLiveScore();

  const handleSkillToggle = (skillName, list, setter) => {
    if (list.includes(skillName)) {
      setter(list.filter((s) => s !== skillName));
    } else {
      setter([...list, skillName]);
    }
  };

  const handleInterestToggle = (interest) => {
    if (seekerInterests.includes(interest)) {
      setSeekerInterests(seekerInterests.filter((i) => i !== interest));
    } else {
      setSeekerInterests([...seekerInterests, interest]);
    }
  };

  const handleLookingForToggle = (item) => {
    if (ventureLookingFor.includes(item)) {
      setVentureLookingFor(ventureLookingFor.filter((i) => i !== item));
    } else {
      setVentureLookingFor([...ventureLookingFor, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {};
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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = availableSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              Step 1 of 1 • Profile Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Welcome, {user?.name}! Let's set up your {user?.role} profile.
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete your profile to unlock precision matching and relevant recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-500 block">Profile Strength</span>
              <span className="text-2xl font-extrabold text-teal-600">{liveScore}%</span>
            </div>
            <div className="w-16 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${liveScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Main Form by Role */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* ================= SEEKER ONBOARDING ================= */}
        {user?.role === 'seeker' && (
          <div className="space-y-8">
            {/* Skills Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Select Your Skills (Critical for Smart Matching)
                </label>
                <span className="text-xs text-slate-500 font-medium">{seekerSkills.length} selected</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Our 70/20/10 engine matches you to opportunities matching these exact skills.
              </p>

              {/* Selected skills pills */}
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
                {seekerSkills.length === 0 ? (
                  <span className="text-xs text-slate-400 self-center">No skills selected yet. Click from the list below.</span>
                ) : (
                  seekerSkills.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      variant="primary"
                      onRemove={(sk) => setSeekerSkills(seekerSkills.filter((item) => item !== sk))}
                    />
                  ))
                )}
              </div>

              {/* Search skills input */}
              <input
                type="text"
                placeholder="Search skills (e.g. React, Python, Figma, SQL)..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
              />

              {/* Skills list grid */}
              <div className="max-h-48 overflow-y-auto p-3 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
                {filteredSkills.slice(0, 45).map((sk) => {
                  const isSelected = seekerSkills.includes(sk.name);
                  return (
                    <button
                      key={sk.name}
                      type="button"
                      onClick={() => handleSkillToggle(sk.name, seekerSkills, setSeekerSkills)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      {sk.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level & Availability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Student', 'Fresher', 'Junior', 'Mid'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeekerLevel(lvl)}
                      className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                        seekerLevel === lvl
                          ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Availability</label>
                <div className="grid grid-cols-2 gap-2">
                  {['full-time', 'part-time'].map((avail) => (
                    <button
                      key={avail}
                      type="button"
                      onClick={() => setSeekerAvailability(avail)}
                      className={`py-2 rounded-xl text-xs font-bold border capitalize text-center transition-all ${
                        seekerAvailability === avail
                          ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {avail}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests & Goals */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Interests & Goals</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'job', label: 'Full-time / Part-time Job' },
                  { id: 'internship', label: 'Internship Opportunity' },
                  { id: 'startup project', label: 'Early Startup Projects & Co-Founding' },
                  { id: 'learn skills', label: 'Building Skills & Mentorship' }
                ].map((item) => {
                  const isChecked = seekerInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInterestToggle(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Education</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="College / University"
                  value={seekerEducation.college}
                  onChange={(e) => setSeekerEducation({ ...seekerEducation, college: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Degree / Course (e.g. B.S. CS)"
                  value={seekerEducation.course}
                  onChange={(e) => setSeekerEducation({ ...seekerEducation, course: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Graduation Year (e.g. 2025)"
                  value={seekerEducation.year}
                  onChange={(e) => setSeekerEducation({ ...seekerEducation, year: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location & Remote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="City, State (e.g. San Francisco, CA)"
                  value={seekerLocation}
                  onChange={(e) => setSeekerLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seekerRemote}
                    onChange={(e) => setSeekerRemote(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span>Open to remote opportunities</span>
                </label>
              </div>
            </div>

            {/* Portfolio Links */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Portfolio & Links</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={seekerPortfolios.github}
                    onChange={(e) => setSeekerPortfolios({ ...seekerPortfolios, github: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={seekerPortfolios.linkedin}
                    onChange={(e) => setSeekerPortfolios({ ...seekerPortfolios, linkedin: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="Personal Project / Site"
                    value={seekerPortfolios.projects}
                    onChange={(e) => setSeekerPortfolios({ ...seekerPortfolios, projects: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Short Bio */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Short Bio</label>
              <textarea
                rows={3}
                placeholder="Briefly describe your passions, background, and what drives you..."
                value={seekerBio}
                onChange={(e) => setSeekerBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ================= ENTREPRENEUR ONBOARDING ================= */}
        {user?.role === 'entrepreneur' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Venture / Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoPack Innovations"
                  value={ventureName}
                  onChange={(e) => setVentureName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Industry / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. CleanTech, AI & ML, FinTech, EdTech"
                  value={ventureIndustry}
                  onChange={(e) => setVentureIndustry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">One-line Tagline</label>
              <input
                type="text"
                placeholder="e.g. Biodegradable mycelium packaging replacing single-use styrofoam"
                value={ventureTagline}
                onChange={(e) => setVentureTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Core Problem & Solution *</label>
              <textarea
                rows={3}
                required
                placeholder="What critical problem are you solving, for whom, and what is your innovative solution?"
                value={ventureProblem}
                onChange={(e) => setVentureProblem(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Venture Stage</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Idea', 'Building', 'MVP', 'Launched'].map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setVentureStage(stg)}
                      className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                        ventureStage === stg
                          ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Pitch Deck / Demo Link</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://pitch.com/your-deck or demo link"
                    value={pitchDeckUrl}
                    onChange={(e) => setPitchDeckUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Who / What are you looking for */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                What Are You Looking For? (Co-founders, Builders, Mentors)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Technical Co-founder',
                  'Business Co-founder',
                  'Full-stack Developer',
                  'UI/UX Designer',
                  'Industry Mentor',
                  'Marketing Lead',
                  'Early Beta Testers'
                ].map((item) => {
                  const isSelected = ventureLookingFor.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleLookingForToggle(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills Needed in your Founding Team */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-900">
                  Skills Needed in Your Founding Team
                </label>
                <span className="text-xs text-slate-500 font-medium">{ventureSkillsNeeded.length} selected</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
                {ventureSkillsNeeded.length === 0 ? (
                  <span className="text-xs text-slate-400 self-center">Select complementary skills your venture needs</span>
                ) : (
                  ventureSkillsNeeded.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      variant="primary"
                      onRemove={(sk) => setVentureSkillsNeeded(ventureSkillsNeeded.filter((i) => i !== sk))}
                    />
                  ))
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
                {availableSkills.slice(0, 36).map((sk) => (
                  <button
                    key={sk.name}
                    type="button"
                    onClick={() => handleSkillToggle(sk.name, ventureSkillsNeeded, setVentureSkillsNeeded)}
                    className={`text-xs px-2.5 py-1 rounded-md border ${
                      ventureSkillsNeeded.includes(sk.name)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sk.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Remote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Base Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA / Bengaluru, IN"
                  value={ventureLocation}
                  onChange={(e) => setVentureLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="sm:pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ventureRemote}
                    onChange={(e) => setVentureRemote(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm font-semibold text-slate-700">Open to remote co-founders and contributors</span>
                </label>
              </div>
            </div>

            {/* Founder Bio / Vision */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Founder Bio & Vision</label>
              <textarea
                rows={3}
                placeholder="Share your personal story, what inspires this idea, and the impact you want to create..."
                value={ventureBio}
                onChange={(e) => setVentureBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ================= STARTUP ONBOARDING ================= */}
        {user?.role === 'startup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Startup Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Health"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Domain / Industry</label>
                <input
                  type="text"
                  placeholder="e.g. HealthTech, AI, ClimateTech"
                  value={startupDomain}
                  onChange={(e) => setStartupDomain(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Short Description *</label>
              <textarea
                rows={3}
                required
                placeholder="What problem are you solving and how?"
                value={startupDesc}
                onChange={(e) => setStartupDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Idea', 'Building', 'Launched'].map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setStartupStage(stg)}
                      className={`py-2 rounded-xl text-xs font-bold border text-center transition-all ${
                        startupStage === stg
                          ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Website</label>
                <input
                  type="url"
                  placeholder="https://yourstartup.com"
                  value={startupWebsite}
                  onChange={(e) => setStartupWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Skills / Roles Needed */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Skills or Roles Needed</label>
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
                {startupSkillsNeeded.length === 0 ? (
                  <span className="text-xs text-slate-400 self-center">Select skills your startup currently needs</span>
                ) : (
                  startupSkillsNeeded.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      variant="primary"
                      onRemove={(sk) => setStartupSkillsNeeded(startupSkillsNeeded.filter((i) => i !== sk))}
                    />
                  ))
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
                {availableSkills.slice(0, 30).map((sk) => (
                  <button
                    key={sk.name}
                    type="button"
                    onClick={() => handleSkillToggle(sk.name, startupSkillsNeeded, setStartupSkillsNeeded)}
                    className={`text-xs px-2.5 py-1 rounded-md border ${
                      startupSkillsNeeded.includes(sk.name)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sk.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= MENTOR ONBOARDING ================= */}
        {user?.role === 'mentor' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Current Role & Company</label>
                <input
                  type="text"
                  placeholder="e.g. VP of Engineering at CloudWave"
                  value={mentorRole}
                  onChange={(e) => setMentorRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  min={1}
                  value={mentorYears}
                  onChange={(e) => setMentorYears(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Experience Type</label>
              <input
                type="text"
                placeholder="e.g. 2x Venture-backed founder, Staff Designer, Enterprise Architect"
                value={mentorExpType}
                onChange={(e) => setMentorExpType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Expertise Areas */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Expertise Areas (Skills & Industries)</label>
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
                {mentorExpertise.length === 0 ? (
                  <span className="text-xs text-slate-400 self-center">Pick areas you can advise on</span>
                ) : (
                  mentorExpertise.map((s) => (
                    <SkillTag
                      key={s}
                      skill={s}
                      variant="primary"
                      onRemove={(sk) => setMentorExpertise(mentorExpertise.filter((i) => i !== sk))}
                    />
                  ))
                )}
              </div>
              <div className="max-h-36 overflow-y-auto p-3 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
                {availableSkills.slice(0, 35).map((sk) => (
                  <button
                    key={sk.name}
                    type="button"
                    onClick={() => handleSkillToggle(sk.name, mentorExpertise, setMentorExpertise)}
                    className={`text-xs px-2.5 py-1 rounded-md border ${
                      mentorExpertise.includes(sk.name)
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
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Weekly Availability</label>
                <input
                  type="text"
                  placeholder="e.g. 1-2 hours/week"
                  value={mentorAvailability}
                  onChange={(e) => setMentorAvailability(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">LinkedIn Profile</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={mentorLinkedin}
                  onChange={(e) => setMentorLinkedin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Short Bio & Advice Style</label>
              <textarea
                rows={3}
                placeholder="Tell potential mentees how you like to help..."
                value={mentorBio}
                onChange={(e) => setMentorBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* ================= RECRUITER ONBOARDING ================= */}
        {user?.role === 'recruiter' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Talent Partners"
                  value={recruiterCompany}
                  onChange={(e) => setRecruiterCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Your Position</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Technical Recruiter"
                  value={recruiterPosition}
                  onChange={(e) => setRecruiterPosition(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Company Website</label>
              <input
                type="url"
                placeholder="https://company.com"
                value={recruiterWebsite}
                onChange={(e) => setRecruiterWebsite(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Primary Hiring Areas</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Frontend Development',
                  'Backend Development',
                  'Design & UI/UX',
                  'Data & AI',
                  'DevOps & Cloud',
                  'Mobile Development',
                  'Marketing',
                  'Business & Management'
                ].map((area) => {
                  const isChecked = recruiterHiringAreas.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleSkillToggle(area, recruiterHiringAreas, setRecruiterHiringAreas)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-teal-50 border-teal-600 text-teal-800 ring-1 ring-teal-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Skip for now & explore
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 text-sm transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Saving Profile...' : 'Save & Continue to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
