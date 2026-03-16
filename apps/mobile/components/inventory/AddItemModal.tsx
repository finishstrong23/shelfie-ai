import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { FoodCategory, StorageLocation } from '../../lib/types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    brand?: string;
    category: FoodCategory;
    location: StorageLocation;
    quantity: number;
    unit?: string;
  }) => void;
}

const categories = Object.values(FoodCategory);
const locationOptions = Object.values(StorageLocation);

export default function AddItemModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<FoodCategory>(FoodCategory.OTHER);
  const [location, setLocation] = useState<StorageLocation>(StorageLocation.FRIDGE);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      brand: brand.trim() || undefined,
      category,
      location,
      quantity: parseFloat(quantity) || 1,
      unit: unit.trim() || undefined,
    });
    // Reset form
    setName('');
    setBrand('');
    setCategory(FoodCategory.OTHER);
    setQuantity('1');
    setUnit('');
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Add Item">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input label="Item Name" value={name} onChangeText={setName} placeholder="e.g., Whole Milk" />
        <Input label="Brand (optional)" value={brand} onChangeText={setBrand} placeholder="e.g., Horizon Organic" />

        <Text className="text-sm font-medium text-gray-700 mb-2">Location</Text>
        <View className="flex-row gap-2 mb-4">
          {locationOptions.map((loc) => (
            <TouchableOpacity
              key={loc}
              onPress={() => setLocation(loc)}
              className={`flex-1 py-2 rounded-lg items-center ${location === loc ? 'bg-primary' : 'bg-gray-100'}`}
            >
              <Text className={`text-sm font-medium ${location === loc ? 'text-white' : 'text-gray-600'}`}>
                {loc.charAt(0) + loc.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full ${category === cat ? 'bg-primary' : 'bg-gray-100'}`}
            >
              <Text className={`text-xs font-medium ${category === cat ? 'text-white' : 'text-gray-600'}`}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" />
          </View>
          <View className="flex-1">
            <Input label="Unit (optional)" value={unit} onChangeText={setUnit} placeholder="e.g., gallon" />
          </View>
        </View>

        <Button title="Add to Inventory" onPress={handleAdd} disabled={!name.trim()} />
      </ScrollView>
    </Modal>
  );
}
