import express from 'express';
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
      console.log(`🚀 SkillSpark Stage 1 Server running on port ${PORT}`);
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
