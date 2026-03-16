import React from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeDetail from '../../components/meals/RecipeDetail';
import { useLogMeal } from '../../hooks/useMeals';
import type { MealSuggestion } from '../../lib/types';

export default function RecipeScreen() {
  const { meal: mealJson } = useLocalSearchParams<{ id: string; meal: string }>();
  const logMeal = useLogMeal();

  const meal: MealSuggestion | null = mealJson ? JSON.parse(mealJson) : null;

  if (!meal) return null;

  const handleCook = () => {
    logMeal.mutate(
      {
        title: meal.title,
        cuisine: meal.cuisine,
        cookTime: meal.cookTimeMinutes,
        recipe: {
          steps: meal.steps,
          ingredients: meal.inventoryIngredientsUsed,
          nutrition: meal.nutritionEstimate,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Meal Logged!', 'Your inventory has been updated.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'Could not log meal. Please try again.');
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <RecipeDetail meal={meal} onCook={handleCook} cooking={logMeal.isPending} />
    </SafeAreaView>
  );
}
