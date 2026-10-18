import express from 'express';
import { body } from 'express-validator';
import {
  getMentors,
  sendMentorRequest,
  getMyMentorRequests,
  updateMentorRequestStatus
} from '../controllers/mentorController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getMentors);
router.get('/mentor-requests/mine', protect, getMyMentorRequests);

router.post(
  '/mentor-requests',
  protect,
  authorizeRoles('seeker', 'startup', 'entrepreneur'),
  [
    body('mentorId').notEmpty().withMessage('mentorId is required'),
    body('message').trim().notEmpty().withMessage('message is required')
  ],
  handleValidationErrors,
  sendMentorRequest
);

router.patch(
  '/mentor-requests/:id',
  protect,
  authorizeRoles('mentor'),
  [
    body('status').isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined')
  ],
  handleValidationErrors,
  updateMentorRequestStatus
);

export default router;
