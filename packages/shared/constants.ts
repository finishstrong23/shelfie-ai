export const SCAN_RATE_LIMIT_FREE = 5; // scans per day
export const MEAL_RATE_LIMIT_FREE = 3; // suggestions per day
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY_DAYS = 30;
export const BCRYPT_ROUNDS = 12;
export const MAX_IMAGE_WIDTH = 1024;
export const IMAGE_QUALITY = 80;
export const SCAN_POLL_INTERVAL_MS = 2000;
export const EXPIRING_SOON_DAYS = 3;

export const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#F59E0B',
  danger: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
} as const;
