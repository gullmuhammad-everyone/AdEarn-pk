import { Router } from 'express';
import {
  getAdminStats,
  getUsers,
  approvePayment,
  rejectPayment,
  getPendingPayments,
  processWithdrawal,
  manageAd
} from '../controllers/admin.controller.js';
import { authenticate, requireAdmin, ipRestrict } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);
router.use(apiLimiter);

// IP restriction for production (optional)
if (process.env.NODE_ENV === 'production') {
  const allowedIPs = process.env.ADMIN_IP ? process.env.ADMIN_IP.split(',') : [];
  router.use(ipRestrict(allowedIPs));
}

// Admin dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getUsers);

// Payment management
router.get('/payments', getPendingPayments);
router.post('/payments/:paymentId/approve', approvePayment);
router.post('/payments/:paymentId/reject', rejectPayment);

// Withdrawal management
router.post('/withdrawals/:withdrawalId/process', processWithdrawal);

// Ad management
router.post('/ads', manageAd);

export default router;