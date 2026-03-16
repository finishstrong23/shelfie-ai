import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
  show: (message: string, type?: 'success' | 'error' | 'info') => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'success',
  show: (message, type = 'success') => {
    set({ visible: true, message, type });
    setTimeout(() => set({ visible: false }), 3000);
  },
  hide: () => set({ visible: false }),
}));

const iconMap = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
} as const;

const colorMap = {
  success: { bg: '#D1FAE5', text: '#065F46', icon: '#10B981' },
  error: { bg: '#FEE2E2', text: '#991B1B', icon: '#EF4444' },
  info: { bg: '#DBEAFE', text: '#1E40AF', icon: '#3B82F6' },
};

export default function ToastContainer() {
  const { visible, message, type, hide } = useToast();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : -100,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [visible]);

  const colors = colorMap[type];

  return (
    <Animated.View
      className="absolute top-14 left-4 right-4 z-50"
      style={{ transform: [{ translateY }] }}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        onPress={hide}
        activeOpacity={0.9}
        className="flex-row items-center p-4 rounded-2xl"
        style={{ backgroundColor: colors.bg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}
      >
        <Ionicons name={iconMap[type]} size={22} color={colors.icon} />
        <Text className="flex-1 ml-3 text-sm font-medium" style={{ color: colors.text }}>
          {message}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
