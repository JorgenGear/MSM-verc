import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonLoaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  imageHeight?: number;
  style?: ViewStyle;
}

export function SkeletonCard({ lines = 3, imageHeight = 200, style }: SkeletonCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground },
        style,
      ]}>
      <SkeletonLoader height={imageHeight} borderRadius={8} />
      <View style={styles.content}>
        {Array(lines)
          .fill(0)
          .map((_, index) => (
            <SkeletonLoader
              key={index}
              width={index === 0 ? '100%' : '80%'}
              height={16}
              style={styles.line}
            />
          ))}
      </View>
    </View>
  );
}

interface SkeletonListProps {
  numItems?: number;
  horizontal?: boolean;
  itemWidth?: number | string;
  itemHeight?: number;
  style?: ViewStyle;
}

export function SkeletonList({
  numItems = 3,
  horizontal = false,
  itemWidth = '100%',
  itemHeight = 100,
  style,
}: SkeletonListProps) {
  return (
    <View
      style={[
        horizontal ? styles.horizontalList : styles.verticalList,
        style,
      ]}>
      {Array(numItems)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={[
              styles.listItem,
              {
                width: itemWidth,
                height: itemHeight,
              },
            ]}>
            <SkeletonLoader
              width="100%"
              height="100%"
              borderRadius={8}
            />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  line: {
    marginBottom: 8,
  },
  horizontalList: {
    flexDirection: 'row',
    gap: 12,
  },
  verticalList: {
    gap: 12,
  },
  listItem: {
    overflow: 'hidden',
  },
}); 