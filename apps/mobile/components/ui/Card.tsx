import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-xl p-4 shadow-sm ${className}`}
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 }}
      {...props}
    >
      {children}
    </View>
  );
}
