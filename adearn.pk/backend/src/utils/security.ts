import { Request } from 'express';

export const getClientIP = (req: Request): string => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         'unknown';
};

export const getUserAgent = (req: Request): string => {
  return req.get('User-Agent') || 'unknown';
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};