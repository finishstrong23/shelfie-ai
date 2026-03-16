import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className={`bg-gray-200 ${className}`}
      style={{ width: width as any, height, borderRadius, opacity }}
    />
  );
}

export function InventoryItemSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View className="flex-1 ml-3">
        <Skeleton width="60%" height={16} className="mb-2" />
        <View className="flex-row gap-2">
          <Skeleton width={60} height={20} borderRadius={10} />
          <Skeleton width={40} height={20} borderRadius={10} />
          <Skeleton width={50} height={20} borderRadius={10} />
        </View>
      </View>
    </View>
  );
}

export function MealCardSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 mb-3" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}>
      <Skeleton width="70%" height={20} className="mb-3" />
      <View className="flex-row gap-2 mb-3">
        <Skeleton width={70} height={24} borderRadius={12} />
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={50} height={24} borderRadius={12} />
      </View>
      <View className="flex-row gap-3">
        <Skeleton width={100} height={16} />
        <Skeleton width={80} height={16} />
      </View>
    </View>
  );
}

export function DashboardSkeleton() {
  return (
    <View className="px-4 py-3">
      <View className="flex-row gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-1 bg-white rounded-xl p-4 items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}>
            <Skeleton width={24} height={24} borderRadius={12} className="mb-2" />
            <Skeleton width={30} height={24} className="mb-1" />
            <Skeleton width={40} height={12} />
          </View>
        ))}
      </View>
      <Skeleton width="40%" height={20} className="mb-3" />
      <View className="flex-row">
        {[1, 2, 3].map((i) => (
          <View key={i} className="mr-3">
            <View className="bg-white rounded-xl p-3 w-36" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}>
              <Skeleton width="80%" height={14} className="mb-1" />
              <Skeleton width="50%" height={12} className="mb-2" />
              <Skeleton width={60} height={20} borderRadius={10} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
