import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { hapticLight } from '../../lib/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles = {
  primary: { bg: 'bg-primary', text: 'text-white' },
  secondary: { bg: 'bg-secondary', text: 'text-white' },
  outline: { bg: 'bg-transparent border border-primary', text: 'text-primary' },
  danger: { bg: 'bg-danger', text: 'text-white' },
  ghost: { bg: 'bg-transparent', text: 'text-primary' },
};

const sizeStyles = {
  sm: { container: 'px-3 py-1.5 rounded-lg', text: 'text-sm' },
  md: { container: 'px-5 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-xl', text: 'text-lg' },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={() => { hapticLight(); onPress(); }}
      disabled={isDisabled}
      className={`${v.bg} ${s.container} items-center justify-center flex-row ${isDisabled ? 'opacity-50' : ''}`}
      style={style}
      activeOpacity={0.7}
    >
      {loading && <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#10B981' : '#fff'} className="mr-2" />}
      <Text className={`${v.text} ${s.text} font-semibold`} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
