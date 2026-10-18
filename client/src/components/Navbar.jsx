import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import { Sparkles, Briefcase, PlusCircle, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                {APP_NAME}
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link to="/opportunities" className="text-sm font-medium text-slate-600 hover:text-teal-600">
                Opportunities
              </Link>
              {isAuthenticated && user?.role === 'seeker' && (
                <Link to="/my-applications" className="text-sm font-medium text-slate-600 hover:text-teal-600">
                  My Applications
                </Link>
              )}
              {isAuthenticated && (user?.role === 'startup' || user?.role === 'recruiter' || user?.role === 'entrepreneur') && (
                <>
                  <Link to="/my-opportunities" className="text-sm font-medium text-slate-600 hover:text-teal-600">
                    My Postings
                  </Link>
                  <Link to="/candidates" className="text-sm font-medium text-slate-600 hover:text-teal-600">
                    Candidates
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {(user?.role === 'startup' || user?.role === 'recruiter' || user?.role === 'entrepreneur') && (
                  <Link
                    to="/post-opportunity"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Opportunity</span>
                  </Link>
                )}
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md capitalize">
                  {user?.name} ({user?.role})
                </span>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-3 py-2">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
