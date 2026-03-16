import { create } from 'zustand';
import type { ScanItem, StorageLocation } from '../lib/types';

interface EditableScanItem extends ScanItem {
  accepted: boolean;
}

interface ScanState {
  scanId: string | null;
  location: StorageLocation | null;
  items: EditableScanItem[];
  isProcessing: boolean;
  setScanId: (id: string | null) => void;
  setLocation: (location: StorageLocation) => void;
  setItems: (items: ScanItem[]) => void;
  updateItem: (index: number, updates: Partial<EditableScanItem>) => void;
  toggleItem: (index: number) => void;
  removeItem: (index: number) => void;
  addItem: (item: EditableScanItem) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>((set) => ({
  scanId: null,
  location: null,
  items: [],
  isProcessing: false,
  setScanId: (scanId) => set({ scanId }),
  setLocation: (location) => set({ location }),
  setItems: (items) =>
    set({
      items: items.map((item) => ({ ...item, accepted: item.confidenceScore >= 0.5 })),
    }),
  updateItem: (index, updates) =>
    set((state) => ({
      items: state.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
    })),
  toggleItem: (index) =>
    set((state) => ({
      items: state.items.map((item, i) =>
        i === index ? { ...item, accepted: !item.accepted } : item
      ),
    })),
  removeItem: (index) =>
    set((state) => ({ items: state.items.filter((_, i) => i !== index) })),
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  reset: () => set({ scanId: null, location: null, items: [], isProcessing: false }),
}));
