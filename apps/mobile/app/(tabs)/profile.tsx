import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useThemeColors } from '../../lib/theme';
import { useLogout } from '../../hooks/useAuth';
import { useInventoryStats } from '../../hooks/useInventory';
import { hapticSelection } from '../../lib/haptics';

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Keto', 'Nut-Free', 'Low-Carb', 'Halal', 'Kosher',
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { isDark, toggle } = useThemeStore();
  const { bg, text, textSecondary, border } = useThemeColors();
  const { data: stats } = useInventoryStats();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.replace('/(auth)/login'),
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-2xl font-bold mb-4" style={{ color: text }}>Profile</Text>

        {/* User info */}
        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-primary-light items-center justify-center">
              <Ionicons name="person" size={28} color="#10B981" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold" style={{ color: text }}>{user?.name || 'User'}</Text>
              <Text className="text-sm" style={{ color: textSecondary }}>{user?.email}</Text>
            </View>
            <Badge label="FREE" variant="primary" size="md" />
          </View>
        </Card>

        {/* Appearance */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color="#10B981" />
              <Text className="text-base font-semibold ml-3" style={{ color: text }}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => { hapticSelection(); toggle(); }}
              trackColor={{ false: '#D1D5DB', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Dietary Preferences */}
        <Card className="mb-4">
          <Text className="text-base font-semibold mb-3" style={{ color: text }}>Dietary Preferences</Text>
          <View className="flex-row flex-wrap gap-2">
            {DIETARY_OPTIONS.map((pref) => {
              const isSelected = user?.dietaryPrefs?.includes(pref);
              return (
                <TouchableOpacity
                  key={pref}
                  className={`px-3 py-1.5 rounded-full border ${
                    isSelected ? 'bg-primary border-primary' : ''
                  }`}
                  style={!isSelected ? { borderColor: border } : undefined}
                >
                  <Text className={`text-sm ${isSelected ? 'text-white font-medium' : ''}`}
                    style={!isSelected ? { color: textSecondary } : undefined}
                  >
                    {pref}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* App Stats */}
        <Card className="mb-4">
          <Text className="text-base font-semibold mb-3" style={{ color: text }}>Your Stats</Text>
          <View className="flex-row justify-between">
            {[
              { label: 'Scans', value: String(stats?.totalScans ?? 0), icon: 'camera' },
              { label: 'Items Tracked', value: String(stats?.totalActive ?? 0), icon: 'list' },
              { label: 'Meals Cooked', value: String(stats?.totalMeals ?? 0), icon: 'restaurant' },
            ].map((stat) => (
              <View key={stat.label} className="items-center flex-1">
                <Ionicons name={stat.icon as any} size={20} color="#10B981" />
                <Text className="text-xl font-bold mt-1" style={{ color: text }}>{stat.value}</Text>
                <Text className="text-xs" style={{ color: textSecondary }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Button title="Sign Out" onPress={handleLogout} variant="outline" loading={logout.isPending} />

        <Text className="text-center text-xs mt-6" style={{ color: textSecondary }}>Shelfie AI v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
