import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import LocationFilter from '../../components/inventory/LocationFilter';
import InventoryList from '../../components/inventory/InventoryList';
import AddItemModal from '../../components/inventory/AddItemModal';
import { useInventory, useAddItem, useDeleteItem } from '../../hooks/useInventory';
import type { StorageLocation, InventoryItem } from '../../lib/types';

export default function InventoryScreen() {
  const [location, setLocation] = useState<StorageLocation | null>(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, isLoading, refetch, isRefetching } = useInventory(
    location ? { location } : undefined
  );
  const addItem = useAddItem();
  const deleteItem = useDeleteItem();

  const items = (data?.items || []).filter((item) =>
    search ? item.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const counts = data?.counts || { fridge: 0, freezer: 0, pantry: 0, expiringSoon: 0 };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LocationFilter selected={location} onSelect={setLocation} counts={counts} />

      {/* Search */}
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-2.5 border border-gray-200">
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search items..."
            className="flex-1 ml-2 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <InventoryList
        items={items}
        refreshing={isRefetching}
        onRefresh={refetch}
        onItemPress={() => {}}
        onConsume={(item) => deleteItem.mutate({ id: item.id, reason: 'consumed' })}
        onWaste={(item) => deleteItem.mutate({ id: item.id, reason: 'wasted' })}
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        className="absolute bottom-28 right-5 w-14 h-14 rounded-full bg-primary items-center justify-center"
        style={{ shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(item) => addItem.mutate(item)}
      />
    </SafeAreaView>
  );
}
