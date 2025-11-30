import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  user?: any;
}

export const setupSocket = (io: Server) => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token and get user
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.user?.email} connected`);

    // Join user to their personal room
    socket.join(`user:${socket.user.id}`);

    // Handle ad watching
    socket.on('startAdWatch', async (data: { adId: string }) => {
      try {
        const ad = await prisma.ad.findUnique({
          where: { id: data.adId }
        });

        if (!ad) {
          socket.emit('error', { message: 'Ad not found' });
          return;
        }

        // Check if user has already watched this ad today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingView = await prisma.adViewLog.findFirst({
          where: {
            userId: socket.user.id,
            adId: data.adId,
            watchedAt: {
              gte: today
            }
          }
        });

        if (existingView) {
          socket.emit('error', { message: 'You have already watched this ad today' });
          return;
        }

        socket.emit('adStarted', { 
          adId: ad.id, 
          duration: ad.duration,
          earnings: ad.earnings 
        });

      } catch (error) {
        console.error('Error starting ad watch:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    socket.on('adCompleted', async (data: { adId: string }) => {
      try {
        const ad = await prisma.ad.findUnique({
          where: { id: data.adId }
        });

        if (!ad) {
          socket.emit('error', { message: 'Ad not found' });
          return;
        }

        // Create ad view log
        const adView = await prisma.adViewLog.create({
          data: {
            userId: socket.user.id,
            adId: data.adId,
            completed: true,
            earnings: ad.earnings,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent'] || 'unknown'
          }
        });

        // Get updated stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayViews = await prisma.adViewLog.count({
          where: {
            userId: socket.user.id,
            watchedAt: { gte: today },
            completed: true
          }
        });

        const totalEarnings = await prisma.adViewLog.aggregate({
          where: {
            userId: socket.user.id,
            watchedAt: { gte: today },
            completed: true
          },
          _sum: { earnings: true }
        });

        const stats = {
          adsToday: todayViews,
          earningsToday: totalEarnings._sum.earnings || 0,
          lastAdEarnings: ad.earnings
        };

        // Emit to user
        socket.emit('adCompleted', {
          earnings: ad.earnings,
          newStats: stats
        });

        // Broadcast to user room for real-time updates
        io.to(`user:${socket.user.id}`).emit('statsUpdate', stats);

        console.log(`User ${socket.user.email} earned ₹${ad.earnings} from ad ${ad.title}`);

      } catch (error) {
        console.error('Error completing ad:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    socket.on('cheatDetected', async (data: { adId: string }) => {
      try {
        await prisma.adViewLog.create({
          data: {
            userId: socket.user.id,
            adId: data.adId,
            completed: false,
            cheatAttempt: true,
            earnings: 0,
            ipAddress: socket.handshake.address,
            userAgent: socket.handshake.headers['user-agent'] || 'unknown'
          }
        });

        console.log(`Cheat detected for user ${socket.user.email} on ad ${data.adId}`);
        
      } catch (error) {
        console.error('Error logging cheat attempt:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.email} disconnected`);
    });
  });
};