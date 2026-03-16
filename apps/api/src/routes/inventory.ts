import { Router, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { getInventory, createInventoryItem } from '../services/inventory';
import {
  addInventoryItemSchema,
  updateInventoryItemSchema,
  deleteInventorySchema,
} from '../lib/validation';
import { AuthenticatedRequest } from '../types';
import { StorageLocation, FoodCategory } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const location = req.query.location as StorageLocation | undefined;
    const category = req.query.category as FoodCategory | undefined;
    const expiringSoon = req.query.expiringSoon === 'true';

    const result = await getInventory(req.userId!, { location, category, expiringSoon });
    res.json(result);
  } catch (err) {
    console.error('Get inventory error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.get('/stats', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    const [
      totalActive,
      consumedThisWeek,
      wastedThisWeek,
      consumedThisMonth,
      wastedThisMonth,
      totalScans,
      totalMeals,
    ] = await Promise.all([
      prisma.inventoryItem.count({ where: { userId, consumedAt: null, wasted: false } }),
      prisma.inventoryItem.count({ where: { userId, consumedAt: { gte: weekAgo }, wasted: false } }),
      prisma.inventoryItem.count({ where: { userId, consumedAt: { gte: weekAgo }, wasted: true } }),
      prisma.inventoryItem.count({ where: { userId, consumedAt: { gte: monthAgo }, wasted: false } }),
      prisma.inventoryItem.count({ where: { userId, consumedAt: { gte: monthAgo }, wasted: true } }),
      prisma.scan.count({ where: { userId } }),
      prisma.mealLog.count({ where: { userId } }),
    ]);

    const weekTotal = consumedThisWeek + wastedThisWeek;
    const savedPercentage = weekTotal > 0 ? Math.round((consumedThisWeek / weekTotal) * 100) : 100;

    res.json({
      totalActive,
      weekly: {
        consumed: consumedThisWeek,
        wasted: wastedThisWeek,
        savedPercentage,
      },
      monthly: {
        consumed: consumedThisMonth,
        wasted: wastedThisMonth,
      },
      totalScans,
      totalMeals,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = addInventoryItemSchema.parse(req.body);

    const item = await createInventoryItem(req.userId!, {
      name: data.name,
      brand: data.brand,
      category: data.category as FoodCategory,
      location: data.location as StorageLocation,
      quantity: data.quantity,
      unit: data.unit,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    });

    res.status(201).json({ item });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Add inventory error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id as string;
    const existing = await prisma.inventoryItem.findFirst({
      where: { id: itemId, userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: 'Item not found', code: 'NOT_FOUND' });
      return;
    }

    const data = updateInventoryItemSchema.parse(req.body);
    const updateData: any = { ...data };
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }

    const item = await prisma.inventoryItem.update({
      where: { id: itemId },
      data: updateData,
    });

    res.json({ item });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Update inventory error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const itemId = req.params.id as string;
    const existing = await prisma.inventoryItem.findFirst({
      where: { id: itemId, userId: req.userId! },
    });

    if (!existing) {
      res.status(404).json({ error: 'Item not found', code: 'NOT_FOUND' });
      return;
    }

    const { reason } = deleteInventorySchema.parse(req.query);

    if (reason === 'consumed') {
      await prisma.inventoryItem.update({
        where: { id: itemId },
        data: { consumedAt: new Date() },
      });
    } else if (reason === 'wasted') {
      await prisma.inventoryItem.update({
        where: { id: itemId },
        data: { wasted: true, consumedAt: new Date() },
      });
    } else {
      await prisma.inventoryItem.delete({
        where: { id: itemId },
      });
    }

    res.json({ success: true });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Delete inventory error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

export default router;
