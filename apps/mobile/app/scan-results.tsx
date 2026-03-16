import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScanResultCard from '../components/scan/ScanResultCard';
import ScanningAnimation from '../components/ui/ScanningAnimation';
import Button from '../components/ui/Button';
import { useScanStatus, useConfirmScan } from '../hooks/useScan';
import { useScanStore } from '../stores/scanStore';
import { useToast } from '../components/ui/Toast';

export default function ScanResultsScreen() {
  const { scanId, items, setItems, updateItem, toggleItem, setProcessing } = useScanStore();
  const { data: scanResult, isLoading } = useScanStatus(scanId);
  const confirmScan = useConfirmScan();
  const toast = useToast();

  useEffect(() => {
    if (scanResult?.status === 'COMPLETED' && scanResult.items.length > 0) {
      setItems(scanResult.items);
      setProcessing(false);
    }
    if (scanResult?.status === 'FAILED') {
      setProcessing(false);
      Alert.alert('Scan Failed', 'Could not identify items. Please try again.');
    }
  }, [scanResult?.status]);

  const handleConfirm = async () => {
    if (!scanId) return;

    try {
      await confirmScan.mutateAsync({
        scanId,
        items: items.map((item) => ({
          itemName: item.itemName,
          brand: item.brand,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          expiresInDays: item.expiresInDays,
          accepted: item.accepted,
        })),
      });
      toast.show(`${acceptedCount} items added to inventory!`, 'success');
      router.replace('/(tabs)/inventory');
    } catch {
      toast.show('Could not save items. Please try again.', 'error');
    }
  };

  if (isLoading || scanResult?.status === 'PROCESSING') {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScanningAnimation />
      </SafeAreaView>
    );
  }

  const acceptedCount = items.filter((i) => i.accepted).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">
          We found {items.length} items
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Review and edit, then confirm to add to your inventory
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <ScanResultCard
            item={item}
            index={index}
            onUpdate={updateItem}
            onToggle={toggleItem}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
      />

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8">
        <Button
          title={`Confirm & Add ${acceptedCount} Items`}
          onPress={handleConfirm}
          loading={confirmScan.isPending}
          disabled={acceptedCount === 0}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
