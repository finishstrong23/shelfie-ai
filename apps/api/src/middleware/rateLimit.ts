import { Response, NextFunction } from 'express';
import { redis } from '../lib/redis';
import { AuthenticatedRequest } from '../types';
import { SCAN_RATE_LIMIT_FREE, MEAL_RATE_LIMIT_FREE } from '@shelfie/shared/constants';

function createRateLimiter(keyPrefix: string, limit: number, windowSeconds: number) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId) {
      res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
      return;
    }

    const key = `${keyPrefix}:${req.userId}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (current > limit) {
        res.status(429).json({
          error: `Rate limit exceeded. Maximum ${limit} requests per day for free tier.`,
          code: 'RATE_LIMIT_EXCEEDED',
        });
        return;
      }

      next();
    } catch {
      // If Redis is down, allow the request
      next();
    }
  };
}

export const scanRateLimit = createRateLimiter('scan_limit', SCAN_RATE_LIMIT_FREE, 86400);
export const mealRateLimit = createRateLimiter('meal_limit', MEAL_RATE_LIMIT_FREE, 86400);
