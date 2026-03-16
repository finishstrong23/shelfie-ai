import React from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InventoryItemCard from './InventoryItem';
import type { InventoryItem } from '../../lib/types';

interface Props {
  items: InventoryItem[];
  refreshing: boolean;
  onRefresh: () => void;
  onItemPress: (item: InventoryItem) => void;
  onConsume: (item: InventoryItem) => void;
  onWaste: (item: InventoryItem) => void;
}

export default function InventoryList({ items, refreshing, onRefresh, onItemPress, onConsume, onWaste }: Props) {
  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Ionicons name="basket-outline" size={64} color="#D1D5DB" />
        <Text className="text-xl font-semibold text-gray-400 mt-4">No items yet</Text>
        <Text className="text-gray-400 mt-1 text-center">Scan your first shelf to get started!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <InventoryItemCard
          item={item}
          onPress={() => onItemPress(item)}
          onConsume={() => onConsume(item)}
          onWaste={() => onWaste(item)}
        />
      )}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />}
    />
  );
}
