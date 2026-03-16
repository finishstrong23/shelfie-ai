import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../stores/authStore';
import { getAccessToken } from '../lib/auth';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
});

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      // Token exists, user is potentially authenticated
      // The API interceptor will handle refresh if needed
      setUser({ id: '', email: '', name: null, dietaryPrefs: [], planTier: 'FREE', createdAt: '' });
      setLoading(false);
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan-results" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recipe/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </QueryClientProvider>
  );
}
