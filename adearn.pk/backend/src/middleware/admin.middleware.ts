import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './auth.middleware.js';

const prisma = new PrismaClient();

/**
 * Middleware to require admin role
 */
export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Admin access required',
        code: 'ADMIN_ACCESS_REQUIRED'
      });
    }

    // Verify admin user exists and is active
    const adminUser = await prisma.user.findUnique({
      where: { 
        id: req.user.id,
        role: 'admin',
        status: 'active'
      },
      select: { id: true, email: true, name: true }
    });

    if (!adminUser) {
      return res.status(403).json({ 
        error: 'Admin account not found or inactive',
        code: 'ADMIN_ACCOUNT_INVALID'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * IP-based access restriction for admin routes
 */
export const ipRestrict = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip IP restriction in development
    if (process.env.NODE_ENV === 'development') {
      return next();
    }

    const clientIP = getClientIP(req);
    
    // Allow localhost and common local IPs
    const localIPs = ['::1', '127.0.0.1', 'localhost'];
    const allAllowedIPs = [...allowedIPs, ...localIPs];

    if (!allAllowedIPs.includes(clientIP)) {
      console.warn(`Admin access denied from IP: ${clientIP}`);
      return res.status(403).json({ 
        error: 'Access denied from your IP address',
        code: 'IP_ACCESS_DENIED',
        yourIP: clientIP
      });
    }

    next();
  };
};

/**
 * Audit logging for admin actions
 */
export const adminActionLogger = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log admin actions after response is sent
    setTimeout(async () => {
      try {
        if (req.user?.role === 'admin') {
          const action = getAdminAction(req);
          const targetId = getTargetId(req);
          const statusCode = res.statusCode;
          
          await prisma.adminLog.create({
            data: {
              adminId: req.user.id,
              action,
              targetId,
              details: {
                method: req.method,
                path: req.path,
                params: req.params,
                query: req.query,
                statusCode,
                userAgent: req.get('User-Agent'),
                timestamp: new Date().toISOString()
              },
              ipAddress: getClientIP(req),
              userAgent: req.get('User-Agent') || 'unknown'
            }
          });
        }
      } catch (error) {
        console.error('Admin action logging error:', error);
        // Don't fail the request if logging fails
      }
    }, 0);

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Rate limiting specifically for admin routes
 */
export const adminRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many admin requests, please try again later.',
    code: 'ADMIN_RATE_LIMIT_EXCEEDED'
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks and static files
    return req.path === '/health' || req.path.startsWith('/uploads/');
  }
};

/**
 * Validation middleware for admin operations
 */
export const validateAdminAction = (action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      switch (action) {
        case 'USER_MANAGEMENT':
          if (req.method === 'POST' || req.method === 'PUT') {
            const { status, role } = req.body;
            const allowedStatuses = ['active', 'suspended', 'pending'];
            const allowedRoles = ['user', 'admin'];
            
            if (status && !allowedStatuses.includes(status)) {
              return res.status(400).json({ 
                error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` 
              });
            }
            
            if (role && !allowedRoles.includes(role)) {
              return res.status(400).json({ 
                error: `Invalid role. Allowed: ${allowedRoles.join(', ')}` 
              });
            }
          }
          break;

        case 'PAYMENT_APPROVAL':
          if (req.method === 'POST') {
            const { action } = req.body;
            const allowedActions = ['approve', 'reject'];
            
            if (!allowedActions.includes(action)) {
              return res.status(400).json({ 
                error: `Invalid action. Allowed: ${allowedActions.join(', ')}` 
              });
            }
            
            if (action === 'reject' && !req.body.reason) {
              return res.status(400).json({ 
                error: 'Rejection reason is required' 
              });
            }
          }
          break;

        case 'AD_MANAGEMENT':
          if (req.method === 'POST') {
            const { title, duration, earnings, isActive } = req.body;
            
            if (!title || title.length < 3) {
              return res.status(400).json({ 
                error: 'Ad title must be at least 3 characters long' 
              });
            }
            
            if (!duration || duration < 10 || duration > 300) {
              return res.status(400).json({ 
                error: 'Ad duration must be between 10 and 300 seconds' 
              });
            }
            
            if (!earnings || earnings < 0.5 || earnings > 10) {
              return res.status(400).json({ 
                error: 'Ad earnings must be between ₹0.5 and ₹10' 
              });
            }
          }
          break;

        default:
          break;
      }

      next();
    } catch (error) {
      console.error('Admin action validation error:', error);
      res.status(400).json({ error: 'Invalid request data' });
    }
  };
};

/**
 * Security headers specifically for admin routes
 */
export const adminSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Additional security headers for admin routes
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache control for admin routes
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
};

// Helper functions
function getClientIP(req: Request): string {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
         'unknown';
}

function getAdminAction(req: Request): string {
  const { method, path } = req;
  
  if (path.includes('/users') && method === 'GET') return 'VIEW_USERS';
  if (path.includes('/users') && method === 'PUT') return 'UPDATE_USER';
  if (path.includes('/payments') && method === 'GET') return 'VIEW_PAYMENTS';
  if (path.includes('/payments') && method === 'POST') return 'PROCESS_PAYMENT';
  if (path.includes('/ads') && method === 'POST') return 'MANAGE_AD';
  if (path.includes('/withdrawals') && method === 'POST') return 'PROCESS_WITHDRAWAL';
  
  return `${method}_${path.split('/').pop()?.toUpperCase() || 'UNKNOWN'}`;
}

function getTargetId(req: Request): string | null {
  const { params, body } = req;
  
  if (params.userId) return params.userId;
  if (params.paymentId) return params.paymentId;
  if (params.adId) return params.adId;
  if (params.withdrawalId) return params.withdrawalId;
  if (body.userId) return body.userId;
  
  return null;
}

/**
 * Export all middleware functions
 */
export default {
  requireAdmin,
  ipRestrict,
  adminActionLogger,
  adminRateLimit,
  validateAdminAction,
  adminSecurityHeaders
};