import express from 'express';
import { body } from 'express-validator';
import {
  getRankedPeople,
  sendTeamRequest,
  getMyTeamRequests,
  updateTeamRequestStatus
} from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/people', protect, getRankedPeople);
router.get('/requests/mine', protect, getMyTeamRequests);

router.post(
  '/requests',
  protect,
  [
    body('ideaId').notEmpty().withMessage('ideaId is required'),
    body('userId').notEmpty().withMessage('userId is required'),
    body('role').trim().notEmpty().withMessage('role is required')
  ],
  handleValidationErrors,
  sendTeamRequest
);

router.patch(
  '/requests/:id',
  protect,
  [
    body('status').isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined')
  ],
  handleValidationErrors,
  updateTeamRequestStatus
);

export default router;
