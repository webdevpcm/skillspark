import express from 'express';
import { body } from 'express-validator';
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  closeOpportunity,
  getMyOpportunities,
  parseOpportunity
} from '../controllers/opportunityController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public / open search
router.get('/', getOpportunities);

// AI parsing for job description text (before :id)
router.post(
  '/parse',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  aiLimiter,
  parseOpportunity
);

// Get current poster's opportunities (before :id)
router.get(
  '/mine',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  getMyOpportunities
);

// Get opportunity by ID
router.get('/:id', getOpportunityById);

// Post new opportunity
router.post(
  '/',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').isIn(['job', 'internship', 'project']).withMessage('Valid type is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  handleValidationErrors,
  createOpportunity
);

// Update opportunity (owner only enforced in controller)
router.put(
  '/:id',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  updateOpportunity
);

// Close opportunity (owner only enforced in controller)
router.patch(
  '/:id/close',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  closeOpportunity
);

export default router;
