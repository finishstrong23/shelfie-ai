import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';
import inventoryRoutes from './routes/inventory';
import mealRoutes from './routes/meals';
import { startScanWorker } from './jobs/processScan';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Global rate limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Serve uploaded thumbnails
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/meals', mealRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Shelfie API running on port ${PORT}`);
});

// Start background workers
try {
  startScanWorker();
  console.log('Scan worker started');
} catch (err) {
  console.warn('Could not start scan worker (Redis may not be available):', (err as Error).message);
}

export default app;
