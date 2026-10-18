import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import {
  Sparkles,
  Briefcase,
  Lightbulb,
  Users,
  Compass,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Inbox
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Render navigation links based on user role
  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link
            to="/opportunities"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive('/opportunities') ? 'text-teal-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Opportunities
          </Link>
          <Link
            to="/idea-board"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive('/idea-board') ? 'text-teal-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Idea Board
          </Link>
          <Link
            to="/mentors"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive('/mentors') ? 'text-teal-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Mentors
          </Link>
        </>
      );
    }

    // Role-specific navigation
    return (
      <>
        <Link
          to="/dashboard"
          className={`text-sm font-medium transition-colors hover:text-teal-600 ${
            isActive('/dashboard') ? 'text-teal-600 font-semibold' : 'text-slate-600'
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/opportunities"
          className={`text-sm font-medium transition-colors hover:text-teal-600 ${
            isActive('/opportunities') ? 'text-teal-600 font-semibold' : 'text-slate-600'
          }`}
        >
          Opportunities
        </Link>

        {user?.role === 'seeker' && (
          <Link
            to="/my-applications"
            className={`text-sm font-medium transition-colors hover:text-teal-600 ${
              isActive('/my-applications') ? 'text-teal-600 font-semibold' : 'text-slate-600'
            }`}
          >
            My Applications
          </Link>
        )}

        {(user?.role === 'startup' || user?.role === 'recruiter' || user?.role === 'entrepreneur') && (
          <>
            <Link
              to="/my-opportunities"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/my-opportunities') ? 'text-teal-600 font-semibold' : 'text-slate-600'
              }`}
            >
              My Postings
            </Link>
            <Link
              to="/candidates"
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                isActive('/candidates') ? 'text-teal-600 font-semibold' : 'text-slate-600'
              }`}
            >
              Candidates
            </Link>
          </>
        )}

        <Link
          to="/idea-board"
          className={`text-sm font-medium transition-colors hover:text-teal-600 ${
            isActive('/idea-board') ? 'text-teal-600 font-semibold' : 'text-slate-600'
          }`}
        >
          Idea Board
        </Link>

        <Link
          to="/people-finder"
          className={`text-sm font-medium transition-colors hover:text-teal-600 ${
            isActive('/people-finder') ? 'text-teal-600 font-semibold' : 'text-slate-600'
          }`}
        >
          Team Finder
        </Link>

        <Link
          to="/mentors"
          className={`text-sm font-medium transition-colors hover:text-teal-600 ${
            isActive('/mentors') ? 'text-teal-600 font-semibold' : 'text-slate-600'
          }`}
        >
          Mentors
        </Link>
      </>
    );
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  {APP_NAME}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              {renderNavLinks()}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Post Opportunity CTA if startup, recruiter or entrepreneur */}
                {(user?.role === 'startup' || user?.role === 'recruiter' || user?.role === 'entrepreneur') && (
                  <Link
                    to="/post-opportunity"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Opportunity</span>
                  </Link>
                )}

                {/* Profile Completion Badge */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{user?.name}</p>
                    <div className="flex items-center gap-1 text-[10px] text-teal-700">
                      <span>{user?.role}</span>
                      <span>•</span>
                      <span className="font-bold">{user?.profileCompletion || 0}%</span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-3 py-2 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-sm transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {renderNavLinks()}
          </div>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role} • {user?.profileCompletion}% completed</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Edit Profile
                  </Link>
                </div>

                {(user?.role === 'startup' || user?.role === 'recruiter' || user?.role === 'entrepreneur') && (
                  <Link
                    to="/post-opportunity"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold shadow-sm"
                  >
                    Post Opportunity
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg px-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
