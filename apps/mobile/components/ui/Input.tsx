import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>}
      <TextInput
        className={`bg-white border ${error ? 'border-danger' : 'border-gray-200'} rounded-xl px-4 py-3 text-base text-gray-900`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-danger text-xs mt-1">{error}</Text>}
    </View>
  );
}
