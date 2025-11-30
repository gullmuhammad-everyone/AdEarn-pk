import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  setup2FA,
  verify2FA
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateRegistration } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Public routes
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/verify', authenticate, verify2FA);

export default router;