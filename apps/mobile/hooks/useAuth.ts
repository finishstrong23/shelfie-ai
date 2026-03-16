import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { setTokens, clearTokens, getAccessToken } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import type { AuthResponse } from '../lib/types';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
  });
}

export function useSignup() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; name?: string }) => {
      const { data } = await api.post<AuthResponse>('/auth/signup', credentials);
      return data;
    },
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      await clearTokens();
    },
    onSuccess: () => {
      logout();
    },
  });
}

export function useCheckAuth() {
  const { setUser, setLoading } = useAuthStore();

  return async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      // Verify token by fetching user data via inventory (lightweight check)
      const { data } = await api.get('/inventory');
      // If we get here, token is valid
      setLoading(false);
    } catch {
      await clearTokens();
      setUser(null);
      setLoading(false);
    }
  };
}
