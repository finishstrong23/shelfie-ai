import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
} from '../services/auth';
import { signupSchema, loginSchema, refreshTokenSchema } from '../lib/validation';

const router = Router();

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = signupSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      res.status(409).json({ error: 'Email already in use', code: 'EMAIL_EXISTS' });
      return;
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        dietaryPrefs: user.dietaryPrefs,
        planTier: user.planTier,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        dietaryPrefs: user.dietaryPrefs,
        planTier: user.planTier,
        createdAt: user.createdAt.toISOString(),
      },
      accessToken,
      refreshToken,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = refreshTokenSchema.parse(req.body);

    const tokenRecord = await validateRefreshToken(data.refreshToken);
    if (!tokenRecord) {
      res.status(401).json({ error: 'Invalid or expired refresh token', code: 'TOKEN_INVALID' });
      return;
    }

    // Revoke old token and generate new ones
    await revokeRefreshToken(data.refreshToken);
    const accessToken = generateAccessToken(tokenRecord.userId);
    const refreshToken = await generateRefreshToken(tokenRecord.userId);

    res.json({ accessToken, refreshToken });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Refresh error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

export default router;
