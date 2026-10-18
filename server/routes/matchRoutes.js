import express from 'express';
import { getMatches, getSkillGap } from '../controllers/matchController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/matches', protect, authorizeRoles('seeker'), getMatches);
router.get('/skill-gap/:opportunityId', protect, authorizeRoles('seeker'), getSkillGap);

export default router;
