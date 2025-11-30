import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDashboardStats,
  getEarningsHistory,
  submitPaymentProof,
  requestWithdrawal
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { apiLimiter } from '../middleware/rateLimit.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/earnings', getEarningsHistory);

// Payment routes
router.post('/payment/proof', upload.single('proofImage'), submitPaymentProof);

// Withdrawal routes
router.post('/withdrawal', requestWithdrawal);

export default router;