import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { MealSuggestion } from '../lib/types';

export function useMealSuggestions(
  filters?: { cuisine?: string; maxCookTime?: number; difficulty?: string },
  enabled = false
) {
  const params = new URLSearchParams();
  if (filters?.cuisine) params.set('cuisine', filters.cuisine);
  if (filters?.maxCookTime) params.set('maxCookTime', String(filters.maxCookTime));
  if (filters?.difficulty) params.set('difficulty', filters.difficulty);

  return useQuery<{ meals: MealSuggestion[] }>({
    queryKey: ['meals', filters],
    queryFn: async () => {
      const { data } = await api.get(`/meals/suggestions?${params.toString()}`);
      return data;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: {
      title: string;
      cuisine?: string | null;
      cookTime?: number | null;
      recipe: object;
      ingredientsUsed?: Array<{ inventoryItemId: string; quantityUsed: number }>;
    }) => {
      const { data } = await api.post('/meals/log', meal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
