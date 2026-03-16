import React from 'react';
import { View, Text } from 'react-native';

export default function ScanOverlay() {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
      {/* Top overlay */}
      <View className="flex-1 bg-black/30 items-center justify-end pb-4">
        <Text className="text-white text-lg font-semibold text-center px-8">
          Point at your fridge, freezer, or pantry shelf
        </Text>
      </View>
      {/* Scanning frame */}
      <View className="h-[60%] flex-row">
        <View className="w-8 bg-black/30" />
        <View className="flex-1 border-2 border-white/50 rounded-2xl" />
        <View className="w-8 bg-black/30" />
      </View>
      {/* Bottom overlay */}
      <View className="flex-1 bg-black/30" />
    </View>
  );
}
