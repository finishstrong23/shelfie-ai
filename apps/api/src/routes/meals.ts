import { Router, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { mealRateLimit } from '../middleware/rateLimit';
import { prisma } from '../lib/prisma';
import { generateMealSuggestions } from '../services/ai';
import { mealSuggestionsQuerySchema, logMealSchema } from '../lib/validation';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.use(authMiddleware);

router.get('/suggestions', mealRateLimit, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const query = mealSuggestionsQuerySchema.parse(req.query);

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { dietaryPrefs: true },
    });

    // Get active inventory
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        userId: req.userId!,
        consumedAt: null,
        wasted: false,
      },
      select: {
        name: true,
        category: true,
        quantity: true,
        unit: true,
        expiresAt: true,
      },
      orderBy: { expiresAt: 'asc' },
    });

    if (inventoryItems.length === 0) {
      res.json({ meals: [] });
      return;
    }

    const meals = await generateMealSuggestions(inventoryItems, {
      dietaryPrefs: user?.dietaryPrefs,
      cuisine: query.cuisine,
      maxCookTime: query.maxCookTime,
      difficulty: query.difficulty,
    });

    res.json({ meals });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Meal suggestions error:', err);
    res.status(500).json({ error: 'Failed to generate meal suggestions', code: 'AI_ERROR' });
  }
});

router.post('/log', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = logMealSchema.parse(req.body);

    const mealLog = await prisma.mealLog.create({
      data: {
        userId: req.userId!,
        title: data.title,
        cuisine: data.cuisine,
        cookTime: data.cookTime,
        recipe: data.recipe as any,
      },
    });

    // Decrement inventory quantities
    if (data.ingredientsUsed) {
      for (const ingredient of data.ingredientsUsed) {
        const item = await prisma.inventoryItem.findFirst({
          where: { id: ingredient.inventoryItemId, userId: req.userId! },
        });

        if (item) {
          const newQuantity = item.quantity - ingredient.quantityUsed;
          if (newQuantity <= 0) {
            await prisma.inventoryItem.update({
              where: { id: item.id },
              data: { consumedAt: new Date(), quantity: 0 },
            });
          } else {
            await prisma.inventoryItem.update({
              where: { id: item.id },
              data: { quantity: newQuantity },
            });
          }
        }
      }
    }

    res.status(201).json({ mealLog });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors[0].message, code: 'VALIDATION_ERROR' });
      return;
    }
    console.error('Log meal error:', err);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  }
});

export default router;
