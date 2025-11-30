import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthRequest } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Configure multer for payment proof uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

export const submitPaymentProof = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, method, packageType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment proof image is required' });
    }

    // Validate package type
    const validPackages = ['silver', 'gold', 'platinum'];
    if (!validPackages.includes(packageType)) {
      return res.status(400).json({ error: 'Invalid package type' });
    }

    // Validate amount based on package
    const packageAmounts = {
      silver: 1000,
      gold: 2000,
      platinum: 3000
    };

    const expectedAmount = packageAmounts[packageType as keyof typeof packageAmounts];
    if (parseFloat(amount) !== expectedAmount) {
      return res.status(400).json({ 
        error: `Invalid amount for ${packageType} package. Expected: ₹${expectedAmount}` 
      });
    }

    // Check if user already has a pending payment
    const existingPayment = await prisma.paymentProof.findFirst({
      where: {
        userId,
        status: 'pending'
      }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        error: 'You already have a pending payment. Please wait for approval.' 
      });
    }

    // Calculate package details
    const packageDetails = {
      silver: { dailyAds: 40, monthlyEarnings: 3000 },
      gold: { dailyAds: 80, monthlyEarnings: 6000 },
      platinum: { dailyAds: 120, monthlyEarnings: 9000 }
    };

    const { dailyAds, monthlyEarnings } = packageDetails[packageType as keyof typeof packageDetails];

    // Create payment proof
    const paymentProof = await prisma.paymentProof.create({
      data: {
        userId,
        imageUrl: `/uploads/${req.file.filename}`,
        amount: parseFloat(amount),
        method,
        status: 'pending'
      }
    });

    // Create or update package subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.packageSubscription.upsert({
      where: { userId },
      update: {
        package: packageType,
        startDate,
        endDate,
        dailyAds,
        monthlyEarnings,
        status: 'active'
      },
      create: {
        userId,
        package: packageType,
        startDate,
        endDate,
        dailyAds,
        monthlyEarnings,
        status: 'active'
      }
    });

    // Update user status to pending (waiting for approval)
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'pending' }
    });

    res.status(201).json({ 
      message: 'Payment proof submitted successfully. Waiting for admin approval.',
      paymentProof: {
        id: paymentProof.id,
        amount: paymentProof.amount,
        method: paymentProof.method,
        status: paymentProof.status,
        createdAt: paymentProof.createdAt
      }
    });

  } catch (error) {
    console.error('Payment proof submission error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      const fs = await import('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const payments = await prisma.paymentProof.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        method: true,
        status: true,
        createdAt: true,
        reviewedAt: true,
        reviewedBy: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit as string)
    });

    const total = await prisma.paymentProof.count({
      where: { userId }
    });

    res.json({
      payments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await prisma.paymentProof.findFirst({
      where: {
        id: paymentId,
        userId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPackageDetails = async (req: Request, res: Response) => {
  try {
    const packages = {
      silver: {
        name: 'Silver',
        dailyAds: 40,
        monthlyEarnings: 3000,
        price: 1000,
        features: [
          '40 ads per day',
          '₹3000 monthly earnings',
          'Basic support',
          'Standard withdrawal processing'
        ]
      },
      gold: {
        name: 'Gold',
        dailyAds: 80,
        monthlyEarnings: 6000,
        price: 2000,
        features: [
          '80 ads per day',
          '₹6000 monthly earnings',
          'Priority support',
          'Faster withdrawal processing',
          'Bonus ads occasionally'
        ]
      },
      platinum: {
        name: 'Platinum', 
        dailyAds: 120,
        monthlyEarnings: 9000,
        price: 3000,
        features: [
          '120 ads per day',
          '₹9000 monthly earnings',
          '24/7 priority support',
          'Instant withdrawal processing',
          'Exclusive bonus ads',
          'Higher earning rates'
        ]
      }
    };

    res.json({ packages });

  } catch (error) {
    console.error('Get package details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentInstructions = async (req: Request, res: Response) => {
  try {
    const instructions = {
      jazzcash: {
        name: 'JazzCash',
        steps: [
          'Open JazzCash App',
          'Go to "Send Money"',
          'Select "Send to Account"',
          'Enter Account Number: 0300 1234567',
          'Enter Amount as per your package',
          'Add Note: "AdEarn Package Payment"',
          'Complete transaction',
          'Take screenshot of confirmation'
        ],
        accountInfo: {
          accountNumber: '0300 1234567',
          accountName: 'AdEarn Pakistan',
          note: 'Include your email in transaction note'
        }
      },
      easypaisa: {
        name: 'EasyPaisa',
        steps: [
          'Open EasyPaisa App',
          'Tap "Send Money"',
          'Select "To Easypaisa Account"',
          'Enter Mobile Number: 0315 1234567',
          'Enter Amount as per your package',
          'Add Transaction Purpose: "Service Payment"',
          'Complete payment',
          'Take screenshot of receipt'
        ],
        accountInfo: {
          mobileNumber: '0315 1234567',
          accountName: 'AdEarn PK',
          note: 'Mention your email in transaction details'
        }
      },
      bank: {
        name: 'Bank Transfer',
        steps: [
          'Visit your bank branch or use online banking',
          'Initiate funds transfer',
          'Enter Bank Account Details',
          'Transfer exact package amount',
          'Add reference: "AdEarn Package"',
          'Keep transaction receipt',
          'Take clear photo of receipt'
        ],
        accountInfo: {
          bankName: 'HBL Bank',
          accountTitle: 'AdEarn Pakistan',
          accountNumber: '1234 5678 9012',
          branchCode: '1234',
          iban: 'PK36HABB0012345678901234'
        }
      }
    };

    res.json({ instructions });

  } catch (error) {
    console.error('Get payment instructions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};