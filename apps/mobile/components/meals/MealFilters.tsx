import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  cuisine: string | undefined;
  setCuisine: (v: string | undefined) => void;
  maxCookTime: number | undefined;
  setMaxCookTime: (v: number | undefined) => void;
  difficulty: string | undefined;
  setDifficulty: (v: string | undefined) => void;
}

const cuisines = ['Any', 'American', 'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean'];
const cookTimes = [
  { label: 'Any', value: undefined },
  { label: '15min', value: 15 },
  { label: '30min', value: 30 },
  { label: '60min', value: 60 },
];
const difficulties = ['Any', 'easy', 'medium', 'hard'];

function PillRow({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string | undefined;
  onSelect: (v: string | undefined) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
      <View className="flex-row gap-2 px-1">
        {items.map((item) => {
          const isActive = item === selected || (item === 'Any' && !selected);
          return (
            <TouchableOpacity
              key={item}
              onPress={() => onSelect(item === 'Any' ? undefined : item)}
              className={`px-4 py-2 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-100'}`}
            >
              <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default function MealFilters({
  cuisine, setCuisine, maxCookTime, setMaxCookTime, difficulty, setDifficulty,
}: Props) {
  return (
    <View className="px-4 py-2">
      <Text className="text-xs font-medium text-gray-500 mb-1">Cuisine</Text>
      <PillRow items={cuisines} selected={cuisine} onSelect={setCuisine} />

      <Text className="text-xs font-medium text-gray-500 mb-1">Cook Time</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row gap-2 px-1">
          {cookTimes.map((t) => {
            const isActive = maxCookTime === t.value;
            return (
              <TouchableOpacity
                key={t.label}
                onPress={() => setMaxCookTime(t.value)}
                className={`px-4 py-2 rounded-full ${isActive || (t.label === 'Any' && !maxCookTime) ? 'bg-primary' : 'bg-gray-100'}`}
              >
                <Text className={`text-sm font-medium ${isActive || (t.label === 'Any' && !maxCookTime) ? 'text-white' : 'text-gray-600'}`}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Text className="text-xs font-medium text-gray-500 mb-1">Difficulty</Text>
      <PillRow items={difficulties} selected={difficulty} onSelect={setDifficulty} />
    </View>
  );
}
