import express from 'express';
import { body } from 'express-validator';
import { searchCandidates, addToShortlist, getShortlist } from '../controllers/candidateController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get(
  '/',
  protect,
  authorizeRoles('recruiter', 'startup', 'entrepreneur'),
  searchCandidates
);

router.post(
  '/shortlist',
  protect,
  authorizeRoles('recruiter', 'startup', 'entrepreneur'),
  [
    body('candidateId').notEmpty().withMessage('candidateId is required')
  ],
  handleValidationErrors,
  addToShortlist
);

router.get(
  '/shortlist',
  protect,
  authorizeRoles('recruiter', 'startup', 'entrepreneur'),
  getShortlist
);

export default router;
