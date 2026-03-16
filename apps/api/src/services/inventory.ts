import { prisma } from '../lib/prisma';
import { StorageLocation, FoodCategory } from '@prisma/client';
import { EXPIRING_SOON_DAYS } from '@shelfie/shared/constants';

export async function getInventory(
  userId: string,
  filters: {
    location?: StorageLocation;
    category?: FoodCategory;
    expiringSoon?: boolean;
  }
) {
  const where: any = {
    userId,
    consumedAt: null,
    wasted: false,
  };

  if (filters.location) {
    where.location = filters.location;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.expiringSoon) {
    const soonDate = new Date(Date.now() + EXPIRING_SOON_DAYS * 86400000);
    where.expiresAt = {
      not: null,
      lte: soonDate,
      gte: new Date(),
    };
  }

  const items = await prisma.inventoryItem.findMany({
    where,
    orderBy: [{ expiresAt: 'asc' }, { addedAt: 'desc' }],
  });

  // Get counts
  const activeWhere = { userId, consumedAt: null, wasted: false };
  const [fridge, freezer, pantry] = await Promise.all([
    prisma.inventoryItem.count({ where: { ...activeWhere, location: 'FRIDGE' } }),
    prisma.inventoryItem.count({ where: { ...activeWhere, location: 'FREEZER' } }),
    prisma.inventoryItem.count({ where: { ...activeWhere, location: 'PANTRY' } }),
  ]);

  const soonDate = new Date(Date.now() + EXPIRING_SOON_DAYS * 86400000);
  const expiringSoon = await prisma.inventoryItem.count({
    where: {
      ...activeWhere,
      expiresAt: { not: null, lte: soonDate, gte: new Date() },
    },
  });

  return { items, counts: { fridge, freezer, pantry, expiringSoon } };
}

export async function createInventoryItem(
  userId: string,
  data: {
    name: string;
    brand?: string | null;
    category: FoodCategory;
    location: StorageLocation;
    quantity: number;
    unit?: string | null;
    expiresAt?: Date | null;
    scanId?: string;
  }
) {
  return prisma.inventoryItem.create({
    data: {
      userId,
      name: data.name,
      brand: data.brand,
      category: data.category,
      location: data.location,
      quantity: data.quantity,
      unit: data.unit,
      expiresAt: data.expiresAt,
      scanId: data.scanId,
    },
  });
}
