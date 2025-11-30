import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { sendApprovalMessage, sendPayoutMessage } from '../whatsapp/whatsapp.service.js';

const prisma = new PrismaClient();

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    // Total users count
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ 
      where: { status: 'active' } 
    });
    const pendingPayments = await prisma.paymentProof.count({
      where: { status: 'pending' }
    });
    const pendingWithdrawals = await prisma.withdrawalRequest.count({
      where: { status: 'pending' }
    });

    // Revenue calculation (sum of all approved payments)
    const revenueData = await prisma.paymentProof.aggregate({
      where: { status: 'approved' },
      _sum: { amount: true }
    });

    // Today's active users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await prisma.adViewLog.groupBy({
      by: ['userId'],
      where: { watchedAt: { gte: today } },
      _count: { userId: true }
    });

    // Weekly earnings data for chart
    const weeklyEarnings = await getWeeklyEarningsData();

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        activeToday: activeToday.length,
        pendingPayments,
        pendingWithdrawals,
        totalRevenue: revenueData._sum.amount || 0
      },
      weeklyEarnings
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, search = '', status = '' } = req.query;
    const limit = 20;
    const skip = (parseInt(page as string) - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) {
      where.status = status;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        subscription: true,
        _count: {
          select: {
            adViews: {
              where: { completed: true }
            },
            payments: true,
            withdrawals: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approvePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;
    const adminId = req.user.id;

    const payment = await prisma.paymentProof.findUnique({
      where: { id: paymentId },
      include: { user: true }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment proof not found' });
    }

    // Update payment status
    await prisma.paymentProof.update({
      where: { id: paymentId },
      data: { 
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: adminId
      }
    });

    // Activate user
    await prisma.user.update({
      where: { id: payment.userId },
      data: { status: 'active' }
    });

    // Get user's subscription to determine package
    const subscription = await prisma.packageSubscription.findUnique({
      where: { userId: payment.userId }
    });

    // Send WhatsApp approval message
    await sendApprovalMessage(
      payment.user.phone,
      payment.user.name,
      subscription?.package || 'standard'
    );

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'APPROVE_PAYMENT',
        targetId: payment.userId,
        details: {
          paymentId: payment.id,
          amount: payment.amount,
          method: payment.method
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ message: 'Payment approved successfully' });

  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rejectPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const payment = await prisma.paymentProof.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment proof not found' });
    }

    await prisma.paymentProof.update({
      where: { id: paymentId },
      data: { 
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: adminId
      }
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'REJECT_PAYMENT',
        targetId: payment.userId,
        details: { paymentId: payment.id, reason },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ message: 'Payment rejected successfully' });

  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPendingPayments = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1 } = req.query;
    const limit = 20;
    const skip = (parseInt(page as string) - 1) * limit;

    const payments = await prisma.paymentProof.findMany({
      where: { status: 'pending' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.paymentProof.count({
      where: { status: 'pending' }
    });

    res.json({
      payments,
      pagination: {
        page: parseInt(page as string),
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get pending payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const processWithdrawal = async (req: AuthRequest, res: Response) => {
  try {
    const { withdrawalId } = req.params;
    const adminId = req.user.id;

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
      include: { user: true }
    });

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    // Update withdrawal status
    await prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: 'processed',
        processedAt: new Date(),
        processedBy: adminId
      }
    });

    // Send WhatsApp payout message
    await sendPayoutMessage(
      withdrawal.user.phone,
      withdrawal.user.name,
      withdrawal.amount
    );

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'PROCESS_WITHDRAWAL',
        targetId: withdrawal.userId,
        details: {
          withdrawalId: withdrawal.id,
          amount: withdrawal.amount,
          method: withdrawal.method
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ message: 'Withdrawal processed successfully' });

  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const manageAd = async (req: AuthRequest, res: Response) => {
  try {
    const { action, adId, ...adData } = req.body;
    const adminId = req.user.id;

    let ad;

    if (action === 'create') {
      ad = await prisma.ad.create({
        data: {
          ...adData,
          duration: parseInt(adData.duration),
          earnings: parseFloat(adData.earnings)
        }
      });
    } else if (action === 'update') {
      ad = await prisma.ad.update({
        where: { id: adId },
        data: {
          ...adData,
          duration: parseInt(adData.duration),
          earnings: parseFloat(adData.earnings)
        }
      });
    } else if (action === 'delete') {
      ad = await prisma.ad.delete({
        where: { id: adId }
      });
    }

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: `AD_${action.toUpperCase()}`,
        targetId: adId,
        details: { adData, action },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ message: `Ad ${action}d successfully`, ad });

  } catch (error) {
    console.error('Manage ad error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function for weekly earnings data
async function getWeeklyEarningsData() {
  const weeklyData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayEarnings = await prisma.adViewLog.aggregate({
      where: {
        watchedAt: {
          gte: date,
          lt: nextDate
        },
        completed: true
      },
      _sum: { earnings: true }
    });
    
    weeklyData.push({
      date: date.toISOString().split('T')[0],
      earnings: dayEarnings._sum.earnings || 0
    });
  }
  
  return weeklyData;
}