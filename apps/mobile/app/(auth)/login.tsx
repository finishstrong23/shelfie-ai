import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLogin } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password) return;
    login.mutate(
      { email: email.trim().toLowerCase(), password },
      {
        onSuccess: () => router.replace('/(tabs)'),
        onError: () => {},
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-primary">Shelfie</Text>
            <Text className="text-gray-500 mt-1">Your smart food inventory</Text>
          </View>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
          />

          {login.error && (
            <Text className="text-danger text-sm mb-3">
              {(login.error as any)?.response?.data?.error || 'Login failed. Please try again.'}
            </Text>
          )}

          <Button title="Sign In" onPress={handleLogin} loading={login.isPending} disabled={!email || !password} />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/(auth)/signup">
              <Text className="text-primary font-semibold">Sign Up</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
