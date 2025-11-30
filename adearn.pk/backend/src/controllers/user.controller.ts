import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { calculateEarnings, getTodayRange } from '../utils/helpers.js';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { start, end } = getTodayRange();

    // Get today's ad views
    const todayViews = await prisma.adViewLog.count({
      where: {
        userId,
        watchedAt: { gte: start, lte: end },
        completed: true
      }
    });

    // Get today's earnings
    const todayEarnings = await prisma.adViewLog.aggregate({
      where: {
        userId,
        watchedAt: { gte: start, lte: end },
        completed: true
      },
      _sum: { earnings: true }
    });

    // Get monthly earnings
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyEarnings = await prisma.adViewLog.aggregate({
      where: {
        userId,
        watchedAt: { gte: monthStart },
        completed: true
      },
      _sum: { earnings: true }
    });

    // Get user subscription
    const subscription = await prisma.packageSubscription.findUnique({
      where: { userId }
    });

    // Get streak (consecutive days with at least one ad watched)
    const streak = await calculateStreak(userId);

    res.json({
      stats: {
        adsToday: todayViews,
        earningsToday: todayEarnings._sum.earnings || 0,
        monthlyEarnings: monthlyEarnings._sum.earnings || 0,
        streak,
        dailyLimit: subscription?.dailyAds || 0
      },
      subscription
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEarningsHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const earnings = await prisma.adViewLog.groupBy({
      by: ['watchedAt'],
      where: {
        userId,
        watchedAt: { gte: startDate },
        completed: true
      },
      _sum: { earnings: true },
      _count: { id: true }
    });

    const formattedEarnings = earnings.map(day => ({
      date: day.watchedAt.toISOString().split('T')[0],
      earnings: day._sum.earnings || 0,
      ads: day._count.id
    }));

    res.json({ earnings: formattedEarnings });

  } catch (error) {
    console.error('Earnings history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitPaymentProof = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, method, packageType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment proof image is required' });
    }

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

    // Create package subscription
    const { dailyAds, monthlyEarnings } = calculateEarnings(packageType);
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

    res.json({ 
      message: 'Payment proof submitted successfully', 
      paymentProof 
    });

  } catch (error) {
    console.error('Payment proof submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const requestWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { amount, method, accountInfo } = req.body;

    // Check if user has sufficient earnings
    const subscription = await prisma.packageSubscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const monthlyEarnings = await prisma.adViewLog.aggregate({
      where: {
        userId,
        watchedAt: { 
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        },
        completed: true
      },
      _sum: { earnings: true }
    });

    const totalEarnings = monthlyEarnings._sum.earnings || 0;

    if (totalEarnings < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient earnings for withdrawal' });
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId,
        amount: parseFloat(amount),
        method,
        accountInfo,
        status: 'pending'
      }
    });

    res.json({ 
      message: 'Withdrawal request submitted successfully', 
      withdrawal 
    });

  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to calculate login streak
async function calculateStreak(userId: string): Promise<number> {
  const adViews = await prisma.adViewLog.findMany({
    where: {
      userId,
      completed: true
    },
    select: { watchedAt: true },
    orderBy: { watchedAt: 'desc' }
  });

  if (adViews.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const uniqueDays = new Set(
    adViews.map(view => view.watchedAt.toISOString().split('T')[0])
  );

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];

    if (sortedDays[i] === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}