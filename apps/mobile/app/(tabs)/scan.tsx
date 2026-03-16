import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CameraViewComponent from '../../components/scan/CameraView';
import ScanOverlay from '../../components/scan/ScanOverlay';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useUploadScan } from '../../hooks/useScan';
import { useScanStore } from '../../stores/scanStore';
import { StorageLocation } from '../../lib/types';

export default function ScanScreen() {
  const [location, setLocation] = useState<StorageLocation>(StorageLocation.FRIDGE);
  const uploadScan = useUploadScan();
  const { setScanId, setLocation: setStoreLocation, setProcessing } = useScanStore();

  const handleCapture = async (uri: string) => {
    setProcessing(true);
    setStoreLocation(location);

    try {
      const result = await uploadScan.mutateAsync({ photoUri: uri, location });
      setScanId(result.scanId);
      router.push('/scan-results');
    } catch (err) {
      setProcessing(false);
      Alert.alert('Scan Failed', 'Could not process the photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleCapture(result.assets[0].uri);
    }
  };

  if (uploadScan.isPending) {
    return <LoadingSpinner message="Uploading photo..." />;
  }

  return (
    <View className="flex-1 bg-black">
      <CameraViewComponent onCapture={handleCapture} />
      <ScanOverlay />

      {/* Photo library button */}
      <TouchableOpacity
        onPress={handlePickImage}
        className="absolute top-16 right-5 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
      >
        <Ionicons name="images" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Location selector */}
      <View className="absolute bottom-32 left-0 right-0 px-6">
        <View className="flex-row bg-black/60 rounded-2xl p-1">
          {[
            { key: StorageLocation.FRIDGE, label: 'Fridge', icon: 'snow' },
            { key: StorageLocation.FREEZER, label: 'Freezer', icon: 'cube' },
            { key: StorageLocation.PANTRY, label: 'Pantry', icon: 'file-tray-stacked' },
          ].map((loc) => (
            <TouchableOpacity
              key={loc.key}
              onPress={() => setLocation(loc.key)}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                location === loc.key ? 'bg-primary' : ''
              }`}
            >
              <Ionicons name={loc.icon as any} size={16} color="#fff" />
              <Text className="text-white text-sm font-medium ml-1">{loc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
