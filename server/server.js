import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { APP_NAME, APP_TAGLINE } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Body Parsing
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman) or matching origin
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly permissive CORS
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    tagline: APP_TAGLINE,
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api', matchRoutes); // /api/matches & /api/skill-gap/:id
app.use('/api/ideas', ideaRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Central error handler
app.use(errorHandler);

import { runSeed } from './seed/seed.js';
import Skill from './models/Skill.js';

// Start server after connecting to database
async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is empty so demo data is always available
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      console.log('Database is empty. Automatically initializing seed data...');
      await runSeed();
    }

    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 ${APP_NAME} Server running on port ${PORT}`);
      console.log(`🎯 "${APP_TAGLINE}"`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`========================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';

// Only start when invoked directly
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
