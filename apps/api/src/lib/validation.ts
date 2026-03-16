import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const scanUploadSchema = z.object({
  location: z.enum(['FRIDGE', 'FREEZER', 'PANTRY']),
});

export const scanConfirmItemSchema = z.object({
  itemName: z.string().min(1),
  brand: z.string().nullable().optional(),
  category: z.enum([
    'PRODUCE', 'DAIRY', 'MEAT', 'SEAFOOD', 'FROZEN', 'GRAINS',
    'CANNED', 'CONDIMENTS', 'SNACKS', 'BEVERAGES', 'BAKING', 'SPICES', 'OTHER',
  ]),
  quantity: z.number().positive(),
  unit: z.string().nullable().optional(),
  expiresInDays: z.number().int().nullable().optional(),
  accepted: z.boolean(),
});

export const scanConfirmSchema = z.object({
  items: z.array(scanConfirmItemSchema).min(1),
});

export const addInventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  brand: z.string().nullable().optional(),
  category: z.enum([
    'PRODUCE', 'DAIRY', 'MEAT', 'SEAFOOD', 'FROZEN', 'GRAINS',
    'CANNED', 'CONDIMENTS', 'SNACKS', 'BEVERAGES', 'BAKING', 'SPICES', 'OTHER',
  ]),
  location: z.enum(['FRIDGE', 'FREEZER', 'PANTRY']),
  quantity: z.number().positive().default(1),
  unit: z.string().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export const updateInventoryItemSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().nullable().optional(),
  category: z.enum([
    'PRODUCE', 'DAIRY', 'MEAT', 'SEAFOOD', 'FROZEN', 'GRAINS',
    'CANNED', 'CONDIMENTS', 'SNACKS', 'BEVERAGES', 'BAKING', 'SPICES', 'OTHER',
  ]).optional(),
  location: z.enum(['FRIDGE', 'FREEZER', 'PANTRY']).optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export const deleteInventorySchema = z.object({
  reason: z.enum(['consumed', 'wasted', 'removed']),
});

export const mealSuggestionsQuerySchema = z.object({
  cuisine: z.string().optional(),
  maxCookTime: z.coerce.number().int().positive().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

export const logMealSchema = z.object({
  title: z.string().min(1),
  cuisine: z.string().nullable().optional(),
  cookTime: z.number().int().positive().nullable().optional(),
  recipe: z.object({}).passthrough(),
  ingredientsUsed: z.array(z.object({
    inventoryItemId: z.string(),
    quantityUsed: z.number().positive(),
  })).optional(),
});

export const scanItemResponseSchema = z.array(z.object({
  itemName: z.string(),
  brand: z.string().nullable(),
  category: z.enum([
    'PRODUCE', 'DAIRY', 'MEAT', 'SEAFOOD', 'FROZEN', 'GRAINS',
    'CANNED', 'CONDIMENTS', 'SNACKS', 'BEVERAGES', 'BAKING', 'SPICES', 'OTHER',
  ]),
  quantity: z.number(),
  unit: z.string().nullable(),
  expiresInDays: z.number().int().nullable(),
  confidenceScore: z.number(),
}));

export const mealSuggestionResponseSchema = z.array(z.object({
  title: z.string(),
  cuisine: z.string(),
  cookTimeMinutes: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  servings: z.number(),
  inventoryIngredientsUsed: z.array(z.object({
    itemName: z.string(),
    quantityUsed: z.number(),
    unit: z.string().nullable(),
  })),
  assumedIngredients: z.array(z.string()),
  missingIngredients: z.array(z.string()),
  steps: z.array(z.string()),
  nutritionEstimate: z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  expiringItemsUsed: z.array(z.string()),
}));
