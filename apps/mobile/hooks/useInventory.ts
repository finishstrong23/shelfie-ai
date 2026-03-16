import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { scheduleExpirationReminders } from '../lib/notifications';
import type { InventoryResponse, InventoryItem, StorageLocation, FoodCategory } from '../lib/types';

export function useInventory(filters?: {
  location?: StorageLocation;
  category?: FoodCategory;
  expiringSoon?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.location) params.set('location', filters.location);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.expiringSoon) params.set('expiringSoon', 'true');

  const query = useQuery<InventoryResponse>({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      const { data } = await api.get(`/inventory?${params.toString()}`);
      return data;
    },
  });

  // Schedule expiration reminders when inventory loads (only for unfiltered list)
  useEffect(() => {
    if (!filters && query.data?.items) {
      scheduleExpirationReminders(query.data.items);
    }
  }, [query.data?.items, filters]);

  return query;
}

export function useInventoryStats() {
  return useQuery<{
    totalActive: number;
    weekly: { consumed: number; wasted: number; savedPercentage: number };
    monthly: { consumed: number; wasted: number };
    totalScans: number;
    totalMeals: number;
  }>({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const { data } = await api.get('/inventory/stats');
      return data;
    },
  });
}

export function useAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      name: string;
      brand?: string | null;
      category: FoodCategory;
      location: StorageLocation;
      quantity: number;
      unit?: string | null;
      expiresAt?: string | null;
    }) => {
      const { data } = await api.post('/inventory', item);
      return data.item as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<InventoryItem>) => {
      const { data } = await api.patch(`/inventory/${id}`, updates);
      return data.item as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: 'consumed' | 'wasted' | 'removed' }) => {
      await api.delete(`/inventory/${id}?reason=${reason}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
