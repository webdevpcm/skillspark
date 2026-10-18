import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import PostOpportunityPage from './pages/PostOpportunityPage';
import MyOpportunitiesPage from './pages/MyOpportunitiesPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import CandidatesPage from './pages/CandidatesPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-opportunity"
            element={
              <ProtectedRoute allowedRoles={['startup', 'recruiter', 'entrepreneur']}>
                <PostOpportunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-opportunities"
            element={
              <ProtectedRoute allowedRoles={['startup', 'recruiter', 'entrepreneur']}>
                <MyOpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute allowedRoles={['startup', 'recruiter', 'entrepreneur']}>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
