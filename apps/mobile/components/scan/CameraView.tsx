import React, { useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import { hapticHeavy } from '../../lib/haptics';

interface Props {
  onCapture: (uri: string) => void;
}

export default function CameraView({ onCapture }: Props) {
  const cameraRef = useRef<ExpoCameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-gray-900">
        <Ionicons name="camera-outline" size={64} color="#fff" />
        <Text className="text-white text-lg font-semibold mt-4 text-center">
          Camera access is needed to scan your food
        </Text>
        <View className="mt-6">
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    hapticHeavy();
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo) onCapture(photo.uri);
  };

  return (
    <View className="flex-1 bg-black">
      <ExpoCameraView ref={cameraRef} className="flex-1" facing="back">
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <TouchableOpacity
            onPress={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/30 items-center justify-center"
            activeOpacity={0.7}
          >
            <View className="w-16 h-16 rounded-full bg-white" />
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
}
