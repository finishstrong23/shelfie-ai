import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const redisConnection = {
  host: new URL(redisUrl).hostname,
  port: parseInt(new URL(redisUrl).port || '6379'),
  password: new URL(redisUrl).password || undefined,
};
