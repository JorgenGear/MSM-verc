import React, { useState } from 'react';
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
  ViewStyle,
  TextStyle,
  PressableProps,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from './IconSymbol';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [scaleAnim] = useState(new Animated.Value(1));

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.mediumGray;
    switch (variant) {
      case 'primary':
        return '#ffffff';
      case 'secondary':
        return '#000000';
      case 'outline':
      case 'text':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <IconSymbol
        name={icon}
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        color={getTextColor()}
        style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}
      />
    );
  };

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
      ]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={!loading && !disabled ? onPress : undefined}
        style={[
          styles.button,
          getSizeStyles(),
          getVariantStyles(),
          disabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
        {...props}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {iconPosition === 'left' && renderIcon()}
            <ThemedText
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
                },
                textStyle,
              ]}>
              {title}
            </ThemedText>
            {iconPosition === 'right' && renderIcon()}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
}); 