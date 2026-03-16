import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useSignup } from '../../hooks/useAuth';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signup = useSignup();

  const handleSignup = () => {
    if (!email.trim() || password.length < 8) return;
    signup.mutate(
      { email: email.trim().toLowerCase(), password, name: name.trim() || undefined },
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
            <Text className="text-gray-500 mt-1">Create your account</Text>
          </View>

          <Input
            label="Name (optional)"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
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
            placeholder="Min 8 characters"
            secureTextEntry
          />

          {signup.error && (
            <Text className="text-danger text-sm mb-3">
              {(signup.error as any)?.response?.data?.error || 'Signup failed. Please try again.'}
            </Text>
          )}

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={signup.isPending}
            disabled={!email || password.length < 8}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/(auth)/login">
              <Text className="text-primary font-semibold">Sign In</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
