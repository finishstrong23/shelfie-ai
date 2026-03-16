import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useLogout } from '../../hooks/useAuth';

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Keto', 'Nut-Free', 'Low-Carb', 'Halal', 'Kosher',
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/login'),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-2xl font-bold text-gray-900 mb-4">Profile</Text>

        {/* User info */}
        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-primary-light items-center justify-center">
              <Ionicons name="person" size={28} color="#10B981" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-900">{user?.name || 'User'}</Text>
              <Text className="text-sm text-gray-500">{user?.email}</Text>
            </View>
            <Badge label="FREE" variant="primary" size="md" />
          </View>
        </Card>

        {/* Dietary Preferences */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Dietary Preferences</Text>
          <View className="flex-row flex-wrap gap-2">
            {DIETARY_OPTIONS.map((pref) => {
              const isSelected = user?.dietaryPrefs?.includes(pref);
              return (
                <TouchableOpacity
                  key={pref}
                  className={`px-3 py-1.5 rounded-full border ${
                    isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-600'}`}>
                    {pref}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* App Stats */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">Your Stats</Text>
          <View className="flex-row justify-between">
            {[
              { label: 'Scans', value: '0', icon: 'camera' },
              { label: 'Items Tracked', value: '0', icon: 'list' },
              { label: 'Meals Cooked', value: '0', icon: 'restaurant' },
            ].map((stat) => (
              <View key={stat.label} className="items-center flex-1">
                <Ionicons name={stat.icon as any} size={20} color="#10B981" />
                <Text className="text-xl font-bold text-gray-900 mt-1">{stat.value}</Text>
                <Text className="text-xs text-gray-500">{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button title="Sign Out" onPress={handleLogout} variant="outline" loading={logout.isPending} />

        <Text className="text-center text-xs text-gray-400 mt-6">Shelfie AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
