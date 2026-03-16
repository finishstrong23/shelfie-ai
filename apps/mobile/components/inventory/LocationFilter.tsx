import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StorageLocation } from '../../lib/types';

interface Props {
  selected: StorageLocation | null;
  onSelect: (location: StorageLocation | null) => void;
  counts: { fridge: number; freezer: number; pantry: number };
}

const locations: { key: StorageLocation | null; label: string; icon: string }[] = [
  { key: null, label: 'All', icon: 'grid' },
  { key: 'FRIDGE' as StorageLocation, label: 'Fridge', icon: 'snow' },
  { key: 'FREEZER' as StorageLocation, label: 'Freezer', icon: 'cube' },
  { key: 'PANTRY' as StorageLocation, label: 'Pantry', icon: 'file-tray-stacked' },
];

export default function LocationFilter({ selected, onSelect, counts }: Props) {
  const getCount = (key: StorageLocation | null) => {
    if (!key) return counts.fridge + counts.freezer + counts.pantry;
    return counts[key.toLowerCase() as keyof typeof counts] || 0;
  };

  return (
    <View className="flex-row px-4 py-2 gap-2">
      {locations.map(({ key, label, icon }) => {
        const isActive = selected === key;
        return (
          <TouchableOpacity
            key={label}
            onPress={() => onSelect(key)}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${isActive ? 'bg-primary' : 'bg-gray-100'}`}
          >
            <Ionicons name={icon as any} size={16} color={isActive ? '#fff' : '#6B7280'} />
            <Text className={`ml-1 text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}>
              {label} ({getCount(key)})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
