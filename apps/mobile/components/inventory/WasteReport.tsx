import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import { useThemeColors } from '../../lib/theme';

interface Props {
  weekly: { consumed: number; wasted: number; savedPercentage: number };
  monthly: { consumed: number; wasted: number };
}

export default function WasteReport({ weekly, monthly }: Props) {
  const { text, textSecondary } = useThemeColors();
  const totalWeek = weekly.consumed + weekly.wasted;

  return (
    <Card className="mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="analytics" size={20} color="#10B981" />
        <Text className="text-base font-semibold ml-2" style={{ color: text }}>Weekly Report</Text>
      </View>

      {/* Progress bar */}
      {totalWeek > 0 ? (
        <>
          <View className="flex-row h-3 rounded-full overflow-hidden bg-gray-100 mb-2">
            <View
              className="bg-primary rounded-full"
              style={{ width: `${weekly.savedPercentage}%` }}
            />
            {weekly.wasted > 0 && (
              <View
                className="bg-danger"
                style={{ width: `${100 - weekly.savedPercentage}%` }}
              />
            )}
          </View>
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-primary mr-1.5" />
              <Text className="text-xs" style={{ color: textSecondary }}>
                {weekly.consumed} consumed
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-danger mr-1.5" />
              <Text className="text-xs" style={{ color: textSecondary }}>
                {weekly.wasted} wasted
              </Text>
            </View>
          </View>
          <View className="bg-primary-light rounded-xl p-3 items-center">
            <Text className="text-2xl font-bold text-primary-dark">{weekly.savedPercentage}%</Text>
            <Text className="text-xs text-primary-dark">food saved this week</Text>
          </View>
        </>
      ) : (
        <View className="items-center py-2">
          <Text className="text-sm" style={{ color: textSecondary }}>
            No items consumed or wasted this week yet
          </Text>
        </View>
      )}

      {/* Monthly summary */}
      {(monthly.consumed > 0 || monthly.wasted > 0) && (
        <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
          <View className="items-center flex-1">
            <Text className="text-lg font-bold" style={{ color: text }}>{monthly.consumed}</Text>
            <Text className="text-xs" style={{ color: textSecondary }}>consumed this month</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-danger">{monthly.wasted}</Text>
            <Text className="text-xs" style={{ color: textSecondary }}>wasted this month</Text>
          </View>
        </View>
      )}
    </Card>
  );
}
