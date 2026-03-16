import { Router, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { scanRateLimit } from '../middleware/rateLimit';
import { prisma } from '../lib/prisma';
import { createInventoryItem } from '../services/inventory';
import { scanQueue } from '../jobs/processScan';
import { scanUploadSchema, scanConfirmSchema } from '../lib/validation';
import { AuthenticatedRequest } from '../types';
import { StorageLocation, FoodCategory } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.post('/', scanRateLimit, upload.single('photo'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Photo is required', code: 'MISSING_PHOTO' });
      return;
    }

    const data = scanUploadSchema.parse(req.body);

    const scan = await prisma.scan.create({
      data: {
        userId: req.userId!,
        location: data.location as StorageLocation,
        status: 'PROCESSING',
      },
    });

    await scanQueue.add('process-scan', {
      scanId: scan.id,
      imagePath: req.file.path,
      location: data.location,
    });

    res.status(202).json({ scanId: scan.id, status: 'PROCESSING' });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Scan upload error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const scanId = req.params.id as string;
    const scan = await prisma.scan.findFirst({
      where: { id: scanId, userId: req.userId! },
      include: { items: true },
    });

    if (!scan) {
      res.status(404).json({ error: 'Scan not found', code: 'NOT_FOUND' });
      return;
    }

    res.json({
      scanId: scan.id,
      status: scan.status,
      location: scan.location,
      itemCount: scan.itemCount,
      items: scan.items,
      createdAt: scan.createdAt.toISOString(),
    });
  } catch (err) {
    console.error('Scan status error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/:id/confirm', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const scanId = req.params.id as string;
    const scan = await prisma.scan.findFirst({
      where: { id: scanId, userId: req.userId! },
    });

    if (!scan) {
      res.status(404).json({ error: 'Scan not found', code: 'NOT_FOUND' });
      return;
    }

    const data = scanConfirmSchema.parse(req.body);
    const acceptedItems = data.items.filter((item) => item.accepted);

    const inventoryItems = [];
    for (const item of acceptedItems) {
      const expiresAt = item.expiresInDays
        ? new Date(Date.now() + item.expiresInDays * 86400000)
        : null;

      const created = await createInventoryItem(req.userId!, {
        name: item.itemName,
        brand: item.brand,
        category: item.category as FoodCategory,
        location: scan.location,
        quantity: item.quantity,
        unit: item.unit,
        expiresAt,
        scanId: scan.id,
      });

      inventoryItems.push(created);
    }

    res.json({ inventoryItems });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Scan confirm error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

export default router;
