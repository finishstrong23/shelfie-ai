import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { MealSuggestion } from '../../lib/types';

interface Props {
  meal: MealSuggestion;
  onPress: () => void;
}

const difficultyColors = {
  easy: 'success',
  medium: 'secondary',
  hard: 'danger',
} as const;

export default function MealCard({ meal, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3">
        <Text className="text-lg font-bold text-gray-900 mb-2">{meal.title}</Text>

        <View className="flex-row items-center gap-2 flex-wrap mb-3">
          <Badge label={meal.cuisine} variant="primary" />
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-500 ml-1">{meal.cookTimeMinutes}min</Text>
          </View>
          <Badge label={meal.difficulty} variant={difficultyColors[meal.difficulty]} />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text className="text-sm text-gray-600 ml-1">
              Uses {meal.inventoryIngredientsUsed.length} items
            </Text>
          </View>
          {meal.expiringItemsUsed.length > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="warning" size={16} color="#F59E0B" />
              <Text className="text-sm text-gray-600 ml-1">
                {meal.expiringItemsUsed.length} expiring
              </Text>
            </View>
          )}
          {meal.missingIngredients.length > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="cart-outline" size={16} color="#EF4444" />
              <Text className="text-sm text-gray-600 ml-1">
                {meal.missingIngredients.length} missing
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
