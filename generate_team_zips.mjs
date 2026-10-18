import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_SRC = 'C:/Users/ayush/OneDrive/Desktop/skillspark';
const OUT_DIR = 'C:/Users/ayush/OneDrive/Desktop/SkillSpark_Team_Contributions';
const STAGING = path.join(OUT_DIR, 'staging');

// Helpers
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(relPath, fromRoot, toRoot) {
  const src = path.join(fromRoot, relPath);
  const dest = path.join(toRoot, relPath);
  if (!fs.existsSync(src)) {
    console.warn(`File not found: ${src}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(relPath, fromRoot, toRoot, exclude = ['node_modules', 'dist', '.git']) {
  const src = path.join(fromRoot, relPath);
  const dest = path.join(toRoot, relPath);
  if (!fs.existsSync(src)) return;
  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const entryRel = path.join(relPath, entry.name);
    if (entry.isDirectory()) {
      copyDir(entryRel, fromRoot, toRoot, exclude);
    } else {
      copyFile(entryRel, fromRoot, toRoot);
    }
  }
}

function zipFolder(sourceFolder, zipFilePath) {
  if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
  console.log(`Zipping ${sourceFolder} -> ${zipFilePath}...`);
  const psCommand = `Compress-Archive -Path "${sourceFolder}/*" -DestinationPath "${zipFilePath}" -Force`;
  execSync(`powershell -NoProfile -Command "${psCommand}"`, { stdio: 'inherit' });
  console.log(`✅ Created: ${zipFilePath}`);
}

async function buildContributions() {
  console.log('🚀 Preparing 3-person GitHub Contribution packages...');
  ensureDir(OUT_DIR);

  // Clean staging
  if (fs.existsSync(STAGING)) fs.rmSync(STAGING, { recursive: true, force: true });
  ensureDir(STAGING);

  const stage1Dir = path.join(STAGING, 'Stage1_Member1');
  const stage2Dir = path.join(STAGING, 'Stage2_Member2');
  const stage3Dir = path.join(STAGING, 'Stage3_Member3');

  ensureDir(stage1Dir);
  ensureDir(stage2Dir);
  ensureDir(stage3Dir);

  // ==========================================
  // 1. BASE COMMON FILES FOR ALL STAGES
  // ==========================================
  const rootCommonFiles = ['package.json', 'README.md'];
  const serverCommonFiles = [
    'server/package.json',
    'server/.env',
    'server/.env.example',
    'server/config.js',
    'server/config/db.js',
    'server/middleware/auth.js',
    'server/middleware/validation.js',
    'server/middleware/rateLimiter.js',
    'server/middleware/errorHandler.js',
    'server/models/Skill.js',
    'server/controllers/skillController.js',
    'server/routes/skillRoutes.js',
    'server/services/matching.js',
    'server/seed/skillsData.js',
    'server/tests/matching.test.js'
  ];
  const clientCommonFiles = [
    'client/package.json',
    'client/index.html',
    'client/vite.config.js',
    'client/tailwind.config.js',
    'client/postcss.config.js',
    'client/.env',
    'client/.env.example',
    'client/src/main.jsx',
    'client/src/index.css',
    'client/src/config.js',
    'client/src/api/client.js',
    'client/src/context/AuthContext.jsx',
    'client/src/components/Footer.jsx',
    'client/src/components/SkillTag.jsx',
    'client/src/components/MatchBadge.jsx',
    'client/src/components/LoadingSpinner.jsx',
    'client/src/components/ProtectedRoute.jsx',
    'client/src/pages/LandingPage.jsx',
    'client/src/pages/LoginPage.jsx',
    'client/src/pages/SignupPage.jsx'
  ];

  // ==========================================
  // STAGE 1: Member 1 (Lead Architecture, Auth, Matching Engine)
  // ==========================================
  console.log('📦 Building Stage 1 (Member 1: Core Foundation & Auth)...');
  [...rootCommonFiles, ...serverCommonFiles, ...clientCommonFiles].forEach(f => copyFile(f, ROOT_SRC, stage1Dir));

  // Member 1 specific: Auth and initial models
  copyFile('server/models/User.js', ROOT_SRC, stage1Dir);
  copyFile('server/controllers/authController.js', ROOT_SRC, stage1Dir);
  copyFile('server/controllers/profileController.js', ROOT_SRC, stage1Dir);
  copyFile('server/routes/authRoutes.js', ROOT_SRC, stage1Dir);
  copyFile('server/routes/profileRoutes.js', ROOT_SRC, stage1Dir);
  copyFile('server/seed/seedData.js', ROOT_SRC, stage1Dir);

  // Stage 1 custom server.js
  const serverJsStage1 = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { APP_NAME, APP_TAGLINE } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports (Stage 1 Core: Auth, Skills, Profile)
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsing
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    tagline: APP_TAGLINE,
    phase: 'Stage 1: Core Foundation & Auth Platform',
    timestamp: new Date().toISOString()
  });
});

// Mount Stage 1 API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);

// Central error handler
app.use(errorHandler);

import { runSeed } from './seed/seed.js';
import Skill from './models/Skill.js';

async function startServer() {
  try {
    await connectDB();
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log('Database empty. Running seed...');
      await runSeed();
    }
    app.listen(PORT, () => {
      console.log(\`🚀 SkillSpark Stage 1 Server running on port \${PORT}\`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
`;
  fs.writeFileSync(path.join(stage1Dir, 'server/server.js'), serverJsStage1);

  // Stage 1 custom seed.js
  const seedJsStage1 = `import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User, { calculateProfileCompletion } from '../models/User.js';
import Skill from '../models/Skill.js';
import { skillsData } from './skillsData.js';
import { usersSeedData, DEMO_PASSWORD } from './seedData.js';

dotenv.config();

export async function runSeed() {
  console.log('🌱 Starting SkillSpark database seeding (Stage 1)...');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({})
  ]);

  console.log(\`📦 Seeding \${skillsData.length} skills with learning resources...\`);
  const insertedSkills = await Skill.insertMany(skillsData);
  console.log(\`✅ \${insertedSkills.length} skills seeded successfully.\`);

  console.log(\`👤 Seeding initial users with demo password: \${DEMO_PASSWORD}...\`);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  const userDocs = usersSeedData.map(userData => {
    const user = new User({
      ...userData,
      passwordHash
    });
    user.profileCompletion = calculateProfileCompletion(user);
    return user;
  });

  const savedUsers = await User.insertMany(userDocs);
  console.log(\`✅ \${savedUsers.length} users created.\`);
  console.log('🎉 Stage 1 Seed completed successfully!');
}

if (process.argv[1] && process.argv[1].replace(/\\\\/g, '/').endsWith('seed.js')) {
  runSeed().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
}
`;
  fs.writeFileSync(path.join(stage1Dir, 'server/seed/seed.js'), seedJsStage1);

  // Stage 1 custom App.jsx
  const appJsxStage1 = `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
`;
  fs.writeFileSync(path.join(stage1Dir, 'client/src/App.jsx'), appJsxStage1);

  // Stage 1 custom Navbar.jsx
  const navbarJsxStage1 = `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../config';
import { Sparkles, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              {APP_NAME}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-800">Hi, {user?.name} ({user?.role})</span>
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
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-3 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 shadow-sm transition-all">
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
`;
  fs.writeFileSync(path.join(stage1Dir, 'client/src/components/Navbar.jsx'), navbarJsxStage1);

  // ==========================================
  // STAGE 2: Member 2 (Opportunities, Applications & AI Parser)
  // Cumulative: Stage 1 + Member 2 additions
  // ==========================================
  console.log('📦 Building Stage 2 (Member 2: Opportunities, Applications & AI)...');
  copyDir('', stage1Dir, stage2Dir); // Copy everything from stage 1 as base

  // Member 2 backend files
  const stage2BackendFiles = [
    'server/models/Opportunity.js',
    'server/models/Application.js',
    'server/models/Shortlist.js',
    'server/controllers/opportunityController.js',
    'server/controllers/applicationController.js',
    'server/controllers/candidateController.js',
    'server/controllers/matchController.js',
    'server/routes/opportunityRoutes.js',
    'server/routes/applicationRoutes.js',
    'server/routes/candidateRoutes.js',
    'server/routes/matchRoutes.js',
    'server/services/aiParser.js'
  ];
  stage2BackendFiles.forEach(f => copyFile(f, ROOT_SRC, stage2Dir));

  // Member 2 frontend files
  const stage2FrontendFiles = [
    'client/src/components/StatusChip.jsx',
    'client/src/pages/OpportunitiesPage.jsx',
    'client/src/pages/OpportunityDetailPage.jsx',
    'client/src/pages/PostOpportunityPage.jsx',
    'client/src/pages/MyOpportunitiesPage.jsx',
    'client/src/pages/MyApplicationsPage.jsx',
    'client/src/pages/CandidatesPage.jsx'
  ];
  stage2FrontendFiles.forEach(f => copyFile(f, ROOT_SRC, stage2Dir));

  // Stage 2 custom server.js (mounts opportunities, applications, matches, candidates)
  const serverJsStage2 = `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { APP_NAME, APP_TAGLINE } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports (Stage 1 + Stage 2 Marketplace & AI)
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsing
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    tagline: APP_TAGLINE,
    phase: 'Stage 2: Opportunity Marketplace, Applications & AI Parser',
    timestamp: new Date().toISOString()
  });
});

// Mount Stage 1 & 2 API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', matchRoutes); // /api/matches & /api/skill-gap/:id
app.use('/api/candidates', candidateRoutes);

// Central error handler
app.use(errorHandler);

import { runSeed } from './seed/seed.js';
import Skill from './models/Skill.js';

async function startServer() {
  try {
    await connectDB();
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log('Database empty. Running seed...');
      await runSeed();
    }
    app.listen(PORT, () => {
      console.log(\`🚀 SkillSpark Stage 2 Server running on port \${PORT}\`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
`;
  fs.writeFileSync(path.join(stage2Dir, 'server/server.js'), serverJsStage2);

  // Stage 2 custom App.jsx
  const appJsxStage2 = `import React from 'react';
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
`;
  fs.writeFileSync(path.join(stage2Dir, 'client/src/App.jsx'), appJsxStage2);

  // Stage 2 custom Navbar.jsx
  const navbarJsxStage2 = `import React, { useState } from 'react';
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
`;
  fs.writeFileSync(path.join(stage2Dir, 'client/src/components/Navbar.jsx'), navbarJsxStage2);

  // ==========================================
  // STAGE 3: Member 3 (Collaboration, Ideation, Mentorship & Entrepreneur)
  // Cumulative: Full Complete Codebase
  // ==========================================
  console.log('📦 Building Stage 3 (Member 3: Complete Project with Ideas, Mentors & Entrepreneur)...');
  copyDir('', ROOT_SRC, stage3Dir, ['node_modules', 'dist', '.git', 'test_prep.mjs']);

  // ==========================================
  // CREATE ZIP ARCHIVES
  // ==========================================
  console.log('🗜 Creating zip archives for each team member...');
  const zip1Path = path.join(OUT_DIR, 'Part1_Member1_Core_Auth_Matching.zip');
  const zip2Path = path.join(OUT_DIR, 'Part2_Member2_Opportunities_Applications_AI.zip');
  const zip3Path = path.join(OUT_DIR, 'Part3_Member3_Ideas_Teams_Mentors_Entrepreneur_Complete.zip');

  zipFolder(stage1Dir, zip1Path);
  zipFolder(stage2Dir, zip2Path);
  zipFolder(stage3Dir, zip3Path);

  // Clean staging folder to leave only zip files
  fs.rmSync(STAGING, { recursive: true, force: true });

  console.log('🎉 All 3 contribution zip packages created successfully in:');
  console.log(OUT_DIR);
}

buildContributions().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
