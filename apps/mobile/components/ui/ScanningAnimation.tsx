import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FOOD_EMOJIS = ['Scanning shelves...', 'Identifying brands...', 'Checking expiration dates...', 'Counting items...'];

export default function ScanningAnimation() {
  const scanLine = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const [statusIndex, setStatusIndex] = React.useState(0);

  useEffect(() => {
    // Scanning line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // Cycle status messages
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % FOOD_EMOJIS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-8 bg-gray-50">
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <View className="w-32 h-32 rounded-3xl bg-primary-light items-center justify-center mb-6">
          <Ionicons name="scan" size={56} color="#10B981" />
          <Animated.View
            className="absolute left-2 right-2 h-0.5 bg-primary rounded-full"
            style={{
              transform: [{
                translateY: scanLine.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 50],
                }),
              }],
            }}
          />
        </View>
      </Animated.View>

      <Text className="text-xl font-bold text-gray-900 mb-2">AI is scanning your food</Text>
      <Text className="text-sm text-gray-500 text-center">{FOOD_EMOJIS[statusIndex]}</Text>
    </View>
  );
}
