import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiGenerationLimiter } from '../middleware/rateLimiter.js';
import {
  createAdvisory,
  listAdvisories,
  getAdvisory,
  deleteAdvisory
} from '../controllers/advisory.controller.js';

const router = Router();

// Protect all advisory endpoints with authentication
router.use(requireAuth);

// Create advisory (with AI Rate Limiting)
router.post('/', aiGenerationLimiter, createAdvisory);

// List user's advisories
router.get('/', listAdvisories);

// Get single advisory by ID
router.get('/:id', getAdvisory);

// Delete single advisory by ID
router.delete('/:id', deleteAdvisory);

export default router;
