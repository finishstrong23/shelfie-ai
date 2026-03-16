export enum PlanTier {
  FREE = 'FREE',
  PRO = 'PRO',
  FAMILY = 'FAMILY',
}

export enum StorageLocation {
  FRIDGE = 'FRIDGE',
  FREEZER = 'FREEZER',
  PANTRY = 'PANTRY',
}

export enum FoodCategory {
  PRODUCE = 'PRODUCE',
  DAIRY = 'DAIRY',
  MEAT = 'MEAT',
  SEAFOOD = 'SEAFOOD',
  FROZEN = 'FROZEN',
  GRAINS = 'GRAINS',
  CANNED = 'CANNED',
  CONDIMENTS = 'CONDIMENTS',
  SNACKS = 'SNACKS',
  BEVERAGES = 'BEVERAGES',
  BAKING = 'BAKING',
  SPICES = 'SPICES',
  OTHER = 'OTHER',
}

export enum ScanStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  dietaryPrefs: string[];
  planTier: PlanTier;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  brand: string | null;
  category: FoodCategory;
  location: StorageLocation;
  quantity: number;
  unit: string | null;
  addedAt: string;
  expiresAt: string | null;
  consumedAt: string | null;
  wasted: boolean;
  scanId: string | null;
}

export interface ScanItem {
  id: string;
  scanId: string;
  itemName: string;
  brand: string | null;
  category: FoodCategory;
  quantity: number;
  unit: string | null;
  confidenceScore: number;
  expiresInDays: number | null;
}

export interface Scan {
  id: string;
  userId: string;
  location: StorageLocation;
  itemCount: number;
  status: ScanStatus;
  createdAt: string;
  items: ScanItem[];
}

export interface MealSuggestion {
  title: string;
  cuisine: string;
  cookTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  inventoryIngredientsUsed: {
    itemName: string;
    quantityUsed: number;
    unit: string | null;
  }[];
  assumedIngredients: string[];
  missingIngredients: string[];
  steps: string[];
  nutritionEstimate: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  expiringItemsUsed: string[];
}

export interface MealLog {
  id: string;
  userId: string;
  title: string;
  cuisine: string | null;
  cookTime: number | null;
  recipe: object;
  rating: number | null;
  cookedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  code: string;
}
