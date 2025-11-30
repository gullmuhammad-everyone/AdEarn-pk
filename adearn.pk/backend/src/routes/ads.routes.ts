import { Router } from 'express';
import {
  getAds,
  getAd,
  logAdView,
  getAdStats
} from '../controllers/ads.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Ad routes
router.get('/', getAds);
router.get('/stats', getAdStats);
router.get('/:adId', getAd);
router.post('/:adId/view', logAdView);

export default router;