import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[90%]">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View className="px-5 py-4">{children}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
