import { useThemeStore } from '../stores/themeStore';

// Helper hook for theme-aware colors (useful for inline styles and Ionicons)
export function useThemeColors() {
  const isDark = useThemeStore((s) => s.isDark);

  return {
    isDark,
    bg: isDark ? '#111827' : '#F9FAFB',
    surface: isDark ? '#1F2937' : '#FFFFFF',
    text: isDark ? '#F9FAFB' : '#111827',
    textSecondary: isDark ? '#9CA3AF' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
    cardShadow: isDark ? '#000' : '#000',
    tabBar: isDark ? '#1F2937' : '#FFFFFF',
    tabBarBorder: isDark ? '#374151' : '#F3F4F6',
  };
}
