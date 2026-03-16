import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { hapticSelection } from '../../lib/haptics';

interface ScanResultItem {
  itemName: string;
  brand: string | null;
  category: string;
  quantity: number;
  unit: string | null;
  confidenceScore: number;
  expiresInDays: number | null;
  accepted: boolean;
}

interface Props {
  item: ScanResultItem;
  index: number;
  onUpdate: (index: number, updates: Partial<ScanResultItem>) => void;
  onToggle: (index: number) => void;
}

export default function ScanResultCard({ item, index, onUpdate, onToggle }: Props) {
  const confidenceVariant = item.confidenceScore >= 0.8 ? 'success' : item.confidenceScore >= 0.5 ? 'secondary' : 'danger';

  return (
    <Card className={`mb-3 ${!item.accepted ? 'opacity-50' : ''}`}>
      <View className="flex-row items-start">
        <TouchableOpacity onPress={() => { hapticSelection(); onToggle(index); }} className="mr-3 mt-1">
          <Ionicons
            name={item.accepted ? 'checkbox' : 'square-outline'}
            size={24}
            color={item.accepted ? '#10B981' : '#D1D5DB'}
          />
        </TouchableOpacity>

        <View className="flex-1">
          <TextInput
            value={item.itemName}
            onChangeText={(text) => onUpdate(index, { itemName: text })}
            className="text-base font-semibold text-gray-900 mb-1 p-0"
          />

          <TextInput
            value={item.brand || ''}
            onChangeText={(text) => onUpdate(index, { brand: text || null })}
            placeholder="Brand (optional)"
            className="text-sm text-gray-500 mb-2 p-0"
            placeholderTextColor="#9CA3AF"
          />

          <View className="flex-row items-center gap-2 flex-wrap">
            <Badge label={item.category} variant="gray" />
            <Badge label={`${Math.round(item.confidenceScore * 100)}%`} variant={confidenceVariant} />
            {item.expiresInDays && (
              <Badge label={`~${item.expiresInDays}d shelf life`} variant="secondary" />
            )}
          </View>

          <View className="flex-row items-center mt-2 gap-2">
            <TouchableOpacity
              onPress={() => onUpdate(index, { quantity: Math.max(0.5, item.quantity - 0.5) })}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="remove" size={16} color="#6B7280" />
            </TouchableOpacity>
            <Text className="text-base font-medium text-gray-900 mx-1">
              {item.quantity}{item.unit ? ` ${item.unit}` : ''}
            </Text>
            <TouchableOpacity
              onPress={() => onUpdate(index, { quantity: item.quantity + 0.5 })}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="add" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}
