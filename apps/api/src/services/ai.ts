import fs from 'fs';
import sharp from 'sharp';
import { claude } from '../lib/claude';
import { scanItemResponseSchema, mealSuggestionResponseSchema } from '../lib/validation';
import { MAX_IMAGE_WIDTH, IMAGE_QUALITY } from '@shelfie/shared/constants';

function stripMarkdownFencing(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim();
}

export async function analyzePhoto(imagePath: string, location: string) {
  // Compress image for API
  const compressedBuffer = await sharp(imagePath)
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: IMAGE_QUALITY })
    .toBuffer();

  const base64Image = compressedBuffer.toString('base64');

  // Save a smaller thumbnail for display
  const thumbPath = imagePath.replace(/\.[^.]+$/, '_thumb.jpg');
  await sharp(imagePath)
    .resize({ width: 400, withoutEnlargement: true })
    .jpeg({ quality: 60 })
    .toFile(thumbPath);

  // Delete original file after compression
  fs.unlink(imagePath, () => {});

  const systemPrompt = `You are a food inventory scanner. Analyze the provided photo of a ${location.toLowerCase()} (fridge, freezer, or pantry) and identify every visible food item.

For each item, provide:
- itemName: The specific product name (e.g., "whole milk", "baby spinach", "sourdough bread")
- brand: The brand name if visible on packaging (e.g., "Horizon Organic", "Dole"). null if not visible.
- category: One of: PRODUCE, DAIRY, MEAT, SEAFOOD, FROZEN, GRAINS, CANNED, CONDIMENTS, SNACKS, BEVERAGES, BAKING, SPICES, OTHER
- quantity: Estimated count or amount (e.g., 1 for a single container, 6 for a six-pack, 0.5 for half-used)
- unit: The unit type if applicable (e.g., "gallon", "bunch", "bag", "bottle", "can", "box", "lb"). null if just a count.
- expiresInDays: Estimated days until expiration based on the food type and typical shelf life. Use common sense defaults (milk: 7-10 days, fresh produce: 5-7 days, condiments: 90+ days, frozen items: 180 days, etc.)
- confidenceScore: Your confidence in the identification from 0.0 to 1.0

Respond ONLY with a valid JSON array. No markdown, no explanation, no preamble.

Be thorough — identify EVERY visible item, even partially obscured ones (lower confidence). Do not hallucinate items that aren't visible.`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: 'Identify all food items in this image.',
              },
            ],
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const cleaned = stripMarkdownFencing(textBlock.text);
      const parsed = JSON.parse(cleaned);
      const validated = scanItemResponseSchema.parse(parsed);
      return { items: validated, thumbnailPath: thumbPath };
    } catch (err) {
      lastError = err as Error;
      console.error(`Scan attempt ${attempt + 1} failed:`, (err as Error).message);
    }
  }

  throw lastError || new Error('Failed to analyze photo after 3 attempts');
}

export async function generateMealSuggestions(
  inventoryItems: Array<{
    name: string;
    category: string;
    quantity: number;
    unit: string | null;
    expiresAt: Date | null;
  }>,
  options: {
    dietaryPrefs?: string[];
    cuisine?: string;
    maxCookTime?: number;
    difficulty?: string;
  }
) {
  const inventoryJson = inventoryItems.map((item) => ({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit,
    daysUntilExpiry: item.expiresAt
      ? Math.ceil((item.expiresAt.getTime() - Date.now()) / 86400000)
      : null,
  }));

  const systemPrompt = `You are a creative home chef assistant. Based on the user's current kitchen inventory, suggest 5 meals they can cook right now.

CURRENT INVENTORY:
${JSON.stringify(inventoryJson, null, 2)}

USER PREFERENCES:
- Dietary restrictions: ${options.dietaryPrefs?.join(', ') || 'None'}
- Requested cuisine: ${options.cuisine || 'Any'}
- Max cook time: ${options.maxCookTime || 'No limit'} minutes
- Difficulty: ${options.difficulty || 'Any'}

RULES:
1. PRIORITIZE ingredients expiring soonest (marked with daysUntilExpiry)
2. Each meal should use at least 3 inventory items
3. It's OK if a recipe needs 1-2 common pantry staples the user might have (salt, pepper, oil, butter) — flag these as "assumed" ingredients
4. If a recipe needs ingredients NOT in inventory and NOT common staples, list them as "missingIngredients"
5. Rank meals by: (a) uses most expiring ingredients, (b) uses most inventory items, (c) minimal missing ingredients

Respond ONLY with valid JSON array. No markdown, no explanation.`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: systemPrompt,
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude');
      }

      const cleaned = stripMarkdownFencing(textBlock.text);
      const parsed = JSON.parse(cleaned);
      const validated = mealSuggestionResponseSchema.parse(parsed);
      return validated;
    } catch (err) {
      lastError = err as Error;
      console.error(`Meal suggestion attempt ${attempt + 1} failed:`, (err as Error).message);
    }
  }

  throw lastError || new Error('Failed to generate meal suggestions after 3 attempts');
}
