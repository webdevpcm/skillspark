import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../config';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">{APP_NAME}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              "{APP_TAGLINE}"
            </p>
            <p className="text-xs text-slate-400">
              Connecting entrepreneurs, job seekers, startups, mentors, and recruiters to build skills and launch real ventures.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/opportunities" className="hover:text-teal-600">Browse Opportunities</Link></li>
              <li><Link to="/idea-board" className="hover:text-teal-600">Startup Idea Board</Link></li>
              <li><Link to="/people-finder" className="hover:text-teal-600">Co-founder & Team Finder</Link></li>
              <li><Link to="/mentors" className="hover:text-teal-600">Find a Mentor</Link></li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">For Ecosystem</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/signup" className="hover:text-teal-600">For Job Seekers & Students</Link></li>
              <li><Link to="/signup" className="hover:text-teal-600">For Founders & Startups</Link></li>
              <li><Link to="/signup" className="hover:text-teal-600">For Industry Mentors</Link></li>
              <li><Link to="/signup" className="hover:text-teal-600">For Talent Recruiters</Link></li>
            </ul>
          </div>

          {/* Core Matching Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Smart Matching</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by SkillSpark's 70/20/10 multi-factor matching engine that analyzes required skills, nice-to-have capabilities, and experience level alignment.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Skills-First Placement</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with modern full-stack craftsmanship</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
