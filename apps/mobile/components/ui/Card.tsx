import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColors } from '../../lib/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  const { surface, cardShadow } = useThemeColors();

  return (
    <View
      className={`rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: surface,
        shadowColor: cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
