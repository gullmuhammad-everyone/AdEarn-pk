import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware.js';

const prisma = new PrismaClient();

export const getAds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's subscription to determine daily limit
    const subscription = await prisma.packageSubscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    // Get today's watched ads count
    const todayViews = await prisma.adViewLog.count({
      where: {
        userId,
        watchedAt: { gte: today },
        completed: true
      }
    });

    const adsRemaining = Math.max(0, subscription.dailyAds - todayViews);

    // Get available ads (excluding already watched today)
    const availableAds = await prisma.ad.findMany({
      where: {
        isActive: true,
        NOT: {
          adViews: {
            some: {
              userId,
              watchedAt: { gte: today },
              completed: true
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      ads: availableAds,
      stats: {
        adsWatchedToday: todayViews,
        adsRemaining,
        dailyLimit: subscription.dailyAds
      }
    });

  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAd = async (req: AuthRequest, res: Response) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    const ad = await prisma.ad.findUnique({
      where: { id: adId, isActive: true }
    });

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Check if user has already watched this ad today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingView = await prisma.adViewLog.findFirst({
      where: {
        userId,
        adId,
        watchedAt: { gte: today },
        completed: true
      }
    });

    if (existingView) {
      return res.status(400).json({ error: 'You have already watched this ad today' });
    }

    res.json({ ad });

  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logAdView = async (req: AuthRequest, res: Response) => {
  try {
    const { adId } = req.params;
    const userId = req.user.id;

    const ad = await prisma.ad.findUnique({
      where: { id: adId }
    });

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Create ad view log
    const adView = await prisma.adViewLog.create({
      data: {
        userId,
        adId,
        completed: true,
        earnings: ad.earnings,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || 'unknown'
      },
      include: {
        ad: true
      }
    });

    res.json({
      message: 'Ad view logged successfully',
      earnings: ad.earnings,
      adView
    });

  } catch (error) {
    console.error('Log ad view error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const stats = await prisma.adViewLog.groupBy({
      by: ['watchedAt'],
      where: {
        userId,
        watchedAt: { gte: startDate },
        completed: true
      },
      _sum: { earnings: true },
      _count: { id: true }
    });

    const formattedStats = stats.map(day => ({
      date: day.watchedAt.toISOString().split('T')[0],
      earnings: day._sum.earnings || 0,
      adsWatched: day._count.id
    }));

    res.json({ stats: formattedStats });

  } catch (error) {
    console.error('Get ad stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};