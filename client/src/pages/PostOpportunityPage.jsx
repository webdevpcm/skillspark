import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import SkillTag from '../components/SkillTag';
import {
  Sparkles,
  Bot,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export default function PostOpportunityPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('job');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [niceToHave, setNiceToHave] = useState([]);
  const [levels, setLevels] = useState(['Junior']);
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(true);
  const [deadline, setDeadline] = useState('');

  // AI Paste box state
  const [pastedText, setPastedText] = useState('');
  const [parsingAI, setParsingAI] = useState(false);
  const [parseNotice, setParseNotice] = useState('');

  const [availableSkills, setAvailableSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  const handleAIParse = async () => {
    if (!pastedText.trim()) {
      alert('Please paste a job description first');
      return;
    }

    setParsingAI(true);
    setParseNotice('');
    try {
      const res = await api.post('/opportunities/parse', { text: pastedText });
      if (res.data.success && res.data.parsed) {
        const p = res.data.parsed;
        if (p.role) setTitle(p.role);
        if (p.requiredSkills?.length) setRequiredSkills(p.requiredSkills);
        if (p.niceToHave?.length) setNiceToHave(p.niceToHave);
        if (p.experienceLevel) setLevels([p.experienceLevel]);
        if (!description) setDescription(pastedText.slice(0, 500));

        setParseNotice(
          `Extracted ${p.requiredSkills?.length || 0} required skills and suggested role: "${p.role}". You can review and edit below.`
        );
      }
    } catch (err) {
      alert('Parse failed: ' + err.message);
    } finally {
      setParsingAI(false);
    }
  };

  const handleToggleLevel = (lvl) => {
    if (levels.includes(lvl)) {
      if (levels.length > 1) {
        setLevels(levels.filter((l) => l !== lvl));
      }
    } else {
      setLevels([...levels, lvl]);
    }
  };

  const handleSkillToggle = (skillName, list, setter) => {
    if (list.includes(skillName)) {
      setter(list.filter((s) => s !== skillName));
    } else {
      setter([...list, skillName]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || requiredSkills.length === 0) {
      setError('Title, description, and at least one required skill are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        type,
        description: description.trim(),
        requiredSkills,
        niceToHave,
        levels,
        location,
        remote,
        deadline: deadline || null
      };

      const res = await api.post('/opportunities', payload);
      if (res.data.success) {
        navigate('/my-opportunities');
      }
    } catch (err) {
      setError(err.message || 'Failed to post opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post an Opportunity</h1>
        <p className="text-sm text-slate-500 mt-1">
          Publish a job, internship, or startup project and let our 70/20/10 engine score candidates automatically.
        </p>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-amber-50 p-6 sm:p-8 rounded-3xl border border-teal-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-teal-800">
          <Bot className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-extrabold">AI & Smart Keyword Job Parser</h2>
        </div>
        <p className="text-xs text-slate-600">
          Have an existing job description draft? Paste it below and our parser will extract the role title, required skills, bonus skills, and experience level from our Skill database.
        </p>

        <textarea
          rows={4}
          placeholder="Paste job description text here (e.g. 'We are hiring a Frontend Intern proficient in React and JavaScript. Nice to have Git experience...')..."
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          className="w-full p-3.5 rounded-2xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />

        <div className="flex items-center justify-between">
          {parseNotice && (
            <p className="text-xs font-semibold text-teal-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{parseNotice}</span>
            </p>
          )}
          <button
            type="button"
            disabled={parsingAI}
            onClick={handleAIParse}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{parsingAI ? 'Analyzing Text...' : 'Auto-Fill Form'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Opportunity Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Frontend Developer Intern"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Opportunity Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="job">Full-Time / Part-Time Job</option>
              <option value="internship">Student Internship</option>
              <option value="project">Startup Project / Co-Founder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Application Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Role Description *
          </label>
          <textarea
            rows={5}
            required
            placeholder="Describe the responsibilities, goals, and culture..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Required Skills (70% factor) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Required Skills (Accounts for 70% of match score) *
            </label>
            <span className="text-xs font-bold text-teal-700">{requiredSkills.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
            {requiredSkills.length === 0 ? (
              <span className="text-xs text-slate-400 self-center">Pick at least one required skill</span>
            ) : (
              requiredSkills.map((s) => (
                <SkillTag
                  key={s}
                  skill={s}
                  variant="primary"
                  onRemove={(sk) => setRequiredSkills(requiredSkills.filter((i) => i !== sk))}
                />
              ))
            )}
          </div>

          <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
            {availableSkills.slice(0, 40).map((sk) => (
              <button
                key={sk.name}
                type="button"
                onClick={() => handleSkillToggle(sk.name, requiredSkills, setRequiredSkills)}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  requiredSkills.includes(sk.name)
                    ? 'bg-teal-600 text-white border-teal-600 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {sk.name}
              </button>
            ))}
          </div>
        </div>

        {/* Nice-to-have Skills (20% factor) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nice-To-Have Skills (Accounts for 20% bonus in match score)
          </label>
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[46px]">
            {niceToHave.length === 0 ? (
              <span className="text-xs text-slate-400 self-center">Optional bonus skills</span>
            ) : (
              niceToHave.map((s) => (
                <SkillTag
                  key={s}
                  skill={s}
                  variant="accent"
                  onRemove={(sk) => setNiceToHave(niceToHave.filter((i) => i !== sk))}
                />
              ))
            )}
          </div>

          <div className="max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 bg-white">
            {availableSkills.slice(0, 30).map((sk) => (
              <button
                key={sk.name}
                type="button"
                onClick={() => handleSkillToggle(sk.name, niceToHave, setNiceToHave)}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  niceToHave.includes(sk.name)
                    ? 'bg-amber-500 text-white border-amber-500 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {sk.name}
              </button>
            ))}
          </div>
        </div>

        {/* Target Seniority Levels (10% factor) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Target Seniority Level (10% match factor)
          </label>
          <div className="flex flex-wrap gap-2">
            {['Student', 'Fresher', 'Junior', 'Mid'].map((lvl) => {
              const isSelected = levels.includes(lvl);
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleToggleLevel(lvl)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600 text-teal-800 ring-2 ring-teal-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={remote}
                onChange={(e) => setRemote(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
              <span>Remote friendly position</span>
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 text-sm transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish Opportunity'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
