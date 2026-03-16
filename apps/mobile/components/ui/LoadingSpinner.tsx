import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export default function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={size} color="#10B981" />
      {message && <Text className="text-gray-500 mt-3 text-center">{message}</Text>}
    </View>
  );
}
