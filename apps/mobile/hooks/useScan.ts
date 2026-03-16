import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { ScanResult, StorageLocation } from '../lib/types';

export function useUploadScan() {
  return useMutation({
    mutationFn: async ({ photoUri, location }: { photoUri: string; location: StorageLocation }) => {
      const formData = new FormData();
      formData.append('photo', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'scan.jpg',
      } as any);
      formData.append('location', location);

      const { data } = await api.post('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data as { scanId: string; status: string };
    },
  });
}

export function useScanStatus(scanId: string | null) {
  return useQuery<ScanResult>({
    queryKey: ['scan', scanId],
    queryFn: async () => {
      const { data } = await api.get(`/scan/${scanId}`);
      return data;
    },
    enabled: !!scanId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 2000;
    },
  });
}

export function useConfirmScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      scanId,
      items,
    }: {
      scanId: string;
      items: Array<{
        itemName: string;
        brand?: string | null;
        category: string;
        quantity: number;
        unit?: string | null;
        expiresInDays?: number | null;
        accepted: boolean;
      }>;
    }) => {
      const { data } = await api.post(`/scan/${scanId}/confirm`, { items });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
