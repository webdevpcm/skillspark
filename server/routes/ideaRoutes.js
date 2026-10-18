import express from 'express';
import { body } from 'express-validator';
import { createIdea, getIdeas, getIdeaById, toggleInterest } from '../controllers/ideaController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getIdeas);
router.get('/:id', getIdeaById);

router.post(
  '/',
  protect,
  authorizeRoles('startup', 'seeker', 'entrepreneur'),
  [
    body('title').trim().notEmpty().withMessage('Idea title is required'),
    body('problem').trim().notEmpty().withMessage('Problem statement is required'),
    body('solution').trim().notEmpty().withMessage('Solution is required')
  ],
  handleValidationErrors,
  createIdea
);

router.post('/:id/interest', protect, toggleInterest);

export default router;
