import React, { useEffect } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

type AnimationType = 'fadeIn' | 'slideUp' | 'scale' | 'fadeInSlide';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedTransition({
  children,
  type = 'fadeIn',
  duration = 300,
  delay = 0,
  style,
}: AnimatedTransitionProps) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    switch (type) {
      case 'fadeIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        );
        break;

      case 'slideUp':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'scale':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'fadeInSlide':
        animations.push(
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: duration * 0.6,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: duration * 0.4,
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    setTimeout(() => {
      Animated.parallel(animations).start();
    }, delay);
  }, []);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fadeIn':
        return {
          opacity: fadeAnim,
        };
      case 'slideUp':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      case 'fadeInSlide':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
} 