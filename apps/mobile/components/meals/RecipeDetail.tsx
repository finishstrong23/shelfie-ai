import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { MealSuggestion } from '../../lib/types';

interface Props {
  meal: MealSuggestion;
  onCook: () => void;
  cooking?: boolean;
}

export default function RecipeDetail({ meal, onCook, cooking }: Props) {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text className="text-2xl font-bold text-gray-900 mb-2">{meal.title}</Text>

      <View className="flex-row items-center gap-3 mb-4">
        <Badge label={meal.cuisine} variant="primary" size="md" />
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-1">{meal.cookTimeMinutes} min</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500 ml-1">{meal.servings} servings</Text>
        </View>
      </View>

      {/* Nutrition */}
      <Card className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Nutrition Estimate</Text>
        <View className="flex-row justify-between">
          {[
            { label: 'Calories', value: meal.nutritionEstimate.calories, unit: '' },
            { label: 'Protein', value: meal.nutritionEstimate.protein, unit: 'g' },
            { label: 'Carbs', value: meal.nutritionEstimate.carbs, unit: 'g' },
            { label: 'Fat', value: meal.nutritionEstimate.fat, unit: 'g' },
          ].map((n) => (
            <View key={n.label} className="items-center">
              <Text className="text-lg font-bold text-gray-900">{n.value}{n.unit}</Text>
              <Text className="text-xs text-gray-500">{n.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Ingredients from inventory */}
      <Card className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">From Your Inventory</Text>
        {meal.inventoryIngredientsUsed.map((ing, i) => (
          <View key={i} className="flex-row items-center py-1">
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text className="text-sm text-gray-700 ml-2">
              {ing.quantityUsed}{ing.unit ? ` ${ing.unit}` : ''} {ing.itemName}
            </Text>
          </View>
        ))}

        {meal.assumedIngredients.length > 0 && (
          <>
            <Text className="text-xs text-gray-500 mt-2 mb-1">Assumed staples:</Text>
            <Text className="text-sm text-gray-500">{meal.assumedIngredients.join(', ')}</Text>
          </>
        )}

        {meal.missingIngredients.length > 0 && (
          <>
            <Text className="text-sm font-semibold text-danger mt-3 mb-1">Missing Ingredients</Text>
            {meal.missingIngredients.map((ing, i) => (
              <View key={i} className="flex-row items-center py-1">
                <Ionicons name="close-circle" size={18} color="#EF4444" />
                <Text className="text-sm text-gray-700 ml-2">{ing}</Text>
              </View>
            ))}
          </>
        )}
      </Card>

      {/* Steps */}
      <Card className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">Instructions</Text>
        {meal.steps.map((step, i) => (
          <View key={i} className="flex-row mb-3">
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mr-3 mt-0.5">
              <Text className="text-xs font-bold text-white">{i + 1}</Text>
            </View>
            <Text className="flex-1 text-sm text-gray-700 leading-5">{step}</Text>
          </View>
        ))}
      </Card>

      <Button title="I Made This!" onPress={onCook} loading={cooking} size="lg" />
    </ScrollView>
  );
}
