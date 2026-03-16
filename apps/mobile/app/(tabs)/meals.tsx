import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/ui/Button';
import { MealCardSkeleton } from '../../components/ui/Skeleton';
import MealCard from '../../components/meals/MealCard';
import MealFilters from '../../components/meals/MealFilters';
import { useMealSuggestions } from '../../hooks/useMeals';

export default function MealsScreen() {
  const [cuisine, setCuisine] = useState<string | undefined>();
  const [maxCookTime, setMaxCookTime] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading, isError, refetch } = useMealSuggestions(
    { cuisine, maxCookTime, difficulty },
    enabled
  );

  const meals = data?.meals || [];

  const handleGenerate = () => {
    if (enabled) {
      refetch();
    } else {
      setEnabled(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">What's for dinner?</Text>
      </View>

      <MealFilters
        cuisine={cuisine}
        setCuisine={setCuisine}
        maxCookTime={maxCookTime}
        setMaxCookTime={setMaxCookTime}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />

      <View className="px-4 py-2">
        <Button
          title={enabled ? 'Regenerate Suggestions' : 'Generate Suggestions'}
          onPress={handleGenerate}
          loading={isLoading}
        />
      </View>

      {isLoading && (
        <View className="px-4">
          <MealCardSkeleton />
          <MealCardSkeleton />
          <MealCardSkeleton />
        </View>
      )}

      {isError && (
        <View className="items-center p-8">
          <Text className="text-danger text-center">
            Failed to generate suggestions. Make sure you have items in your inventory.
          </Text>
        </View>
      )}

      {meals.length > 0 && (
        <FlatList
          data={meals}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <MealCard
              meal={item}
              onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: String(index), meal: JSON.stringify(item) } })}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        />
      )}

      {enabled && !isLoading && meals.length === 0 && !isError && (
        <View className="items-center p-8">
          <Text className="text-gray-400 text-center">
            No meal suggestions available. Add more items to your inventory!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
