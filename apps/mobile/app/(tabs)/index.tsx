import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/ui/Card';
import ExpirationBadge from '../../components/inventory/ExpirationBadge';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import WasteReport from '../../components/inventory/WasteReport';
import { useInventory, useInventoryStats } from '../../hooks/useInventory';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors } from '../../lib/theme';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { bg, text, textSecondary } = useThemeColors();
  const { data, isLoading, refetch, isRefetching } = useInventory();
  const { data: expiringData } = useInventory({ expiringSoon: true });
  const { data: stats } = useInventoryStats();

  const counts = data?.counts || { fridge: 0, freezer: 0, pantry: 0, expiringSoon: 0 };
  const expiringItems = expiringData?.items || [];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#10B981" />}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold" style={{ color: text }}>
            Hey{user?.name ? ` ${user.name}` : ''}
          </Text>
          <Text className="text-sm mt-0.5" style={{ color: textSecondary }}>{today}</Text>
        </View>

        {/* Skeleton Loading State */}
        {isLoading && <DashboardSkeleton />}

        {/* Quick Stats */}
        {!isLoading && <View className="flex-row px-4 py-3 gap-3">
          {[
            { label: 'Fridge', count: counts.fridge, icon: 'snow', color: '#3B82F6' },
            { label: 'Freezer', count: counts.freezer, icon: 'cube', color: '#8B5CF6' },
            { label: 'Pantry', count: counts.pantry, icon: 'file-tray-stacked', color: '#F59E0B' },
          ].map((stat) => (
            <TouchableOpacity
              key={stat.label}
              onPress={() => router.push('/(tabs)/inventory')}
              className="flex-1"
            >
              <Card className="items-center py-4">
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                <Text className="text-2xl font-bold mt-1" style={{ color: text }}>{stat.count}</Text>
                <Text className="text-xs text-gray-500">{stat.label}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>}

        {/* Expiring Soon */}
        {expiringItems.length > 0 && (
          <View className="mt-2">
            <View className="px-5 flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-gray-900">Expiring Soon</Text>
              <View className="bg-danger-light px-2 py-0.5 rounded-full">
                <Text className="text-xs font-medium text-red-700">{expiringItems.length} items</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
              {expiringItems.slice(0, 10).map((item) => (
                <Card key={item.id} className="mr-3 w-36">
                  <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                    {item.quantity}{item.unit ? ` ${item.unit}` : ''}
                  </Text>
                  <View className="mt-2">
                    <ExpirationBadge expiresAt={item.expiresAt} />
                  </View>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Weekly Waste Report */}
        {stats && (stats.weekly.consumed > 0 || stats.weekly.wasted > 0) && (
          <View className="px-4 mt-4">
            <WasteReport weekly={stats.weekly} monthly={stats.monthly} />
          </View>
        )}

        {/* Empty state */}
        {!isLoading && counts.fridge + counts.freezer + counts.pantry === 0 && (
          <View className="items-center py-12 px-8">
            <Ionicons name="camera-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-gray-400 mt-4 text-center">
              Scan your first shelf to get started!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/scan')}
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Scan Button */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/scan')}
        className="absolute bottom-28 right-5 w-16 h-16 rounded-full bg-primary items-center justify-center"
        style={{ shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 }}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
