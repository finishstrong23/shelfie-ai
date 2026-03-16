import React, { useRef, useState } from 'react';
import {
  View, Text, FlatList, Dimensions, TouchableOpacity, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hapticLight } from '../lib/haptics';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'camera' as const,
    color: '#10B981',
    bgColor: '#D1FAE5',
    title: 'Snap Your Shelves',
    description: 'Take a photo of your fridge, freezer, or pantry. Our AI identifies every item instantly.',
  },
  {
    icon: 'list' as const,
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    title: 'Track Everything',
    description: 'Build a digital inventory with expiration dates. Never forget what you have on hand.',
  },
  {
    icon: 'restaurant' as const,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    title: 'Cook Smarter',
    description: 'Get personalized meal suggestions that use your ingredients before they expire. Zero waste.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = async () => {
    hapticLight();
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    hapticLight();
    await AsyncStorage.setItem('onboarding_complete', 'true');
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Skip button */}
      <View className="absolute top-16 right-6 z-10">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-400 text-base font-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-10">
            <View
              className="w-40 h-40 rounded-[40px] items-center justify-center mb-12"
              style={{ backgroundColor: item.bgColor }}
            >
              <Ionicons name={item.icon} size={72} color={item.color} />
            </View>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
              {item.title}
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Bottom area: dots + button */}
      <View className="px-8 pb-14">
        {/* Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                className="h-2 rounded-full bg-primary mx-1"
                style={{ width: dotWidth, opacity }}
              />
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary py-4 rounded-2xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
