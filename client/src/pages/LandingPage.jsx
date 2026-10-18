import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME, APP_TAGLINE } from '../config';
import api from '../api/client';
import MatchBadge from '../components/MatchBadge';
import SkillTag from '../components/SkillTag';
import {
  Sparkles,
  ArrowRight,
  Target,
  Compass,
  Users,
  Lightbulb,
  CheckCircle,
  Briefcase,
  Layers,
  GraduationCap,
  Building2,
  UserCheck
} from 'lucide-react';

export default function LandingPage() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await api.get('/opportunities?status=open');
        if (res.data.success) {
          setFeaturedJobs(res.data.opportunities.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured jobs:', err);
      }
    }
    fetchFeatured();
  }, []);

  const handleQuickDemoLogin = async (email, password) => {
    setLoadingDemo(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert('Demo login failed: ' + err.message);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Next-Gen Opportunity & Skill Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            From Skills to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-amber-600">Opportunities</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The collaborative platform connecting students, founders, mentors, and recruiters. Get matched to jobs, build missing skills, find co-founders, and turn ideas into thriving ventures.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/25 transition-all text-base"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/25 transition-all text-base"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/opportunities"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all text-base"
                >
                  <span>Explore Opportunities</span>
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Accounts Banner for pair programming & testing */}
          <div className="mt-12 p-4 bg-white/80 backdrop-blur rounded-2xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo Logins (Click to Test Any Persona)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Password: Password123!</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                disabled={loadingDemo}
                onClick={() => handleQuickDemoLogin('alex.rivera@example.com', 'Password123!')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Alex Rivera</p>
                <p className="text-[11px] text-slate-500">Seeker (Frontend)</p>
              </button>
              <button
                disabled={loadingDemo}
                onClick={() => handleQuickDemoLogin('maya.lin@ecopack.io', 'Password123!')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Maya Lin</p>
                <p className="text-[11px] text-slate-500">Entrepreneur</p>
              </button>
              <button
                disabled={loadingDemo}
                onClick={() => handleQuickDemoLogin('founder@nexushealth.io', 'Password123!')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Nexus Health</p>
                <p className="text-[11px] text-slate-500">Startup Founder</p>
              </button>
              <button
                disabled={loadingDemo}
                onClick={() => handleQuickDemoLogin('sarah.jenkins@mentor.com', 'Password123!')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-500">Mentor (VP Eng)</p>
              </button>
              <button
                disabled={loadingDemo}
                onClick={() => handleQuickDemoLogin('sgrey@apextalent.com', 'Password123!')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700">Apex Talent</p>
                <p className="text-[11px] text-slate-500">Tech Recruiter</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How {APP_NAME} Works
          </h2>
          <p className="mt-3 text-slate-600">
            A seamless journey from setting your skills to getting placed or launching a startup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Build Skill Profile</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pick your proven skills, set your experience level, and highlight portfolio links. We calculate your profile completion score.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Smart Matching</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our 70/20/10 algorithm automatically scores open opportunities, showing matched and missing skills with plain-language reasons.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Bridge Skill Gaps</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Don't have every required skill? SkillSpark provides curated direct learning resources and links to level up immediately.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Apply or Co-Found</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apply without duplicate hassles, join early startup projects, connect with mentors, or pitch your own venture idea.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Preview */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
              <p className="text-sm text-slate-500">Live roles and startup projects ready for applications</p>
            </div>
            <Link
              to="/opportunities"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {job.type}
                    </span>
                    {job.remote && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Remote
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{job.title}</h3>
                  <p className="text-xs text-slate-500 mb-4">{job.owner?.name || 'Company'}</p>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.slice(0, 3).map((s) => (
                      <SkillTag key={s} skill={s} />
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-xs text-slate-400 self-center">
                        +{job.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/opportunities/${job._id}`}
                  className="w-full text-center py-2.5 rounded-xl border border-teal-600 text-teal-600 font-semibold text-sm hover:bg-teal-50 transition-colors"
                >
                  View Details & Match
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Persona Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 sm:p-14 text-white">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">
              One Unified Ecosystem for Four Key Personas
            </h2>
            <p className="mt-3 text-slate-300 text-base">
              Whether you are an aspiring student, a founder building MVP, a veteran mentor giving back, or a recruiter finding verified talent.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <GraduationCap className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Job Seekers & Students</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Match to jobs based on proven skills, discover learning links for missing requirements, and track application statuses.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <Lightbulb className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Startups & Founders</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Post ideas to the idea board, discover ranked team members for your needed skill stack, and post project opportunities.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <Compass className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Industry Mentors</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Share your guidance with founders and seekers, manage requests, and set your weekly availability with ease.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <Building2 className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="font-bold text-lg mb-2">Talent Recruiters</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rank candidates automatically against specific job openings, filter by skills and seniority, and build curated shortlists.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
