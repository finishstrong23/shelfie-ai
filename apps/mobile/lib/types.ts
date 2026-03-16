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
  planTier: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
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
  scan?: { photoUrl: string | null } | null;
}

export interface ScanItem {
  id: string;
  itemName: string;
  brand: string | null;
  category: FoodCategory;
  quantity: number;
  unit: string | null;
  confidenceScore: number;
  expiresInDays: number | null;
}

export interface ScanResult {
  scanId: string;
  status: ScanStatus;
  location: StorageLocation;
  itemCount: number;
  items: ScanItem[];
}

export interface InventoryResponse {
  items: InventoryItem[];
  counts: {
    fridge: number;
    freezer: number;
    pantry: number;
    expiringSoon: number;
  };
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

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
