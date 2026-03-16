import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  load: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  toggle: () => {
    const next = !get().isDark;
    set({ isDark: next });
    AsyncStorage.setItem('theme_dark', next ? 'true' : 'false');
  },
  load: async () => {
    const stored = await AsyncStorage.getItem('theme_dark');
    if (stored !== null) {
      set({ isDark: stored === 'true' });
    } else {
      // Follow system theme by default
      set({ isDark: Appearance.getColorScheme() === 'dark' });
    }
  },
}));
