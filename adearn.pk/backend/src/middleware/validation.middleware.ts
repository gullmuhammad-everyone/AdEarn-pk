import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const phoneRegex = /^92[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid Pakistani phone number format (92XXXXXXXXXX)' });
  }

  next();
};

export const validatePackage = (req: Request, res: Response, next: NextFunction) => {
  const { packageType } = req.body;

  if (!['silver', 'gold', 'platinum'].includes(packageType)) {
    return res.status(400).json({ error: 'Invalid package type' });
  }

  next();
};