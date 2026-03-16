import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'gray' | 'success';
  size?: 'sm' | 'md';
}

const variantStyles = {
  primary: 'bg-primary-light',
  secondary: 'bg-secondary-light',
  danger: 'bg-danger-light',
  gray: 'bg-gray-100',
  success: 'bg-green-100',
};

const textStyles = {
  primary: 'text-primary-dark',
  secondary: 'text-amber-700',
  danger: 'text-red-700',
  gray: 'text-gray-600',
  success: 'text-green-700',
};

export default function Badge({ label, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <View className={`${variantStyles[variant]} rounded-full ${size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'}`}>
      <Text className={`${textStyles[variant]} ${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium`}>
        {label}
      </Text>
    </View>
  );
}
