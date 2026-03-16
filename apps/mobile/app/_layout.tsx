import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/authStore';
import { getAccessToken } from '../lib/auth';
import { useThemeStore } from '../stores/themeStore';
import { requestNotificationPermissions } from '../lib/notifications';
import ToastContainer from '../components/ui/Toast';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setUser, setLoading } = useAuthStore();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [token, onboarded] = await Promise.all([
          getAccessToken(),
          AsyncStorage.getItem('onboarding_complete'),
        ]);
        setOnboardingDone(onboarded === 'true');
        if (token) {
          setUser({ id: '', email: '', name: null, dietaryPrefs: [], planTier: 'FREE', createdAt: '' });
          // Request notification permissions after auth
          requestNotificationPermissions();
        }
      } catch {
        setOnboardingDone(true); // Skip onboarding on error
      } finally {
        setLoading(false);
        SplashScreen.hideAsync();
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoading || onboardingDone === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // Show onboarding first if never completed
    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    if (onboardingDone && !isAuthenticated && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, onboardingDone, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AuthGate>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="scan-results" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="recipe/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        </Stack>
        <ToastContainer />
      </AuthGate>
    </QueryClientProvider>
  );
}
