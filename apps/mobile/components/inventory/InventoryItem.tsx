import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ExpirationBadge from './ExpirationBadge';
import { hapticSuccess, hapticError } from '../../lib/haptics';
import { useThemeColors } from '../../lib/theme';
import type { InventoryItem as InventoryItemType } from '../../lib/types';

interface Props {
  item: InventoryItemType;
  onPress: () => void;
  onConsume: () => void;
  onWaste: () => void;
}

const categoryIcons: Record<string, string> = {
  PRODUCE: 'leaf',
  DAIRY: 'water',
  MEAT: 'restaurant',
  SEAFOOD: 'fish',
  FROZEN: 'snow',
  GRAINS: 'nutrition',
  CANNED: 'cube',
  CONDIMENTS: 'color-fill',
  SNACKS: 'fast-food',
  BEVERAGES: 'cafe',
  BAKING: 'pizza',
  SPICES: 'flame',
  OTHER: 'ellipse',
};

export default function InventoryItemCard({ item, onPress, onConsume, onWaste }: Props) {
  const { text, textSecondary } = useThemeColors();
  const photoUrl = item.scan?.photoUrl;
  const apiBase = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

  return (
    <Card className="mb-3">
      <TouchableOpacity onPress={onPress} className="flex-row items-center">
        {photoUrl ? (
          <Image
            source={{ uri: `${apiBase}${photoUrl}` }}
            className="w-10 h-10 rounded-full mr-3"
            style={{ backgroundColor: '#D1FAE5' }}
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-primary-light items-center justify-center mr-3">
            <Ionicons name={(categoryIcons[item.category] || 'ellipse') as any} size={20} color="#10B981" />
          </View>
        )}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-semibold" style={{ color: text }}>{item.name}</Text>
            {item.brand && <Text className="text-xs" style={{ color: textSecondary }}>{item.brand}</Text>}
          </View>
          <View className="flex-row items-center gap-2 mt-1">
            <Badge label={item.category} variant="gray" />
            <Text className="text-sm" style={{ color: textSecondary }}>
              {item.quantity}{item.unit ? ` ${item.unit}` : ''}
            </Text>
            <ExpirationBadge expiresAt={item.expiresAt} />
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => { hapticSuccess(); onConsume(); }} className="p-2">
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { hapticError(); onWaste(); }} className="p-2">
            <Ionicons name="trash" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
