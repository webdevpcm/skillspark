import express from 'express';
import { body } from 'express-validator';
import {
  applyToOpportunity,
  getMyApplications,
  getOpportunityApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Seeker applies to opportunity
router.post(
  '/',
  protect,
  authorizeRoles('seeker'),
  [
    body('opportunityId').notEmpty().withMessage('Opportunity ID is required')
  ],
  handleValidationErrors,
  applyToOpportunity
);

// Seeker views their own applications
router.get(
  '/mine',
  protect,
  authorizeRoles('seeker'),
  getMyApplications
);

// Poster views applications for a specific opportunity
router.get(
  '/opportunity/:id',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  getOpportunityApplications
);

// Poster updates application status
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('startup', 'recruiter', 'entrepreneur'),
  [
    body('status').isIn(['Submitted', 'Reviewing', 'Shortlisted', 'Rejected', 'Accepted']).withMessage('Valid status is required')
  ],
  handleValidationErrors,
  updateApplicationStatus
);

export default router;
