/**
 * Custom hook for managing color scheme in MainStreet Markets
 * Currently enforces light mode for a consistent brand experience
 */

import { useColorScheme as useNativeColorScheme } from 'react-native';

// Define valid color scheme types
type ColorScheme = 'light' | 'dark' | null;

export function useColorScheme(): ColorScheme {
  // We can use the native hook if we want to support system theme later
  // const systemColorScheme = useNativeColorScheme();
  
  // For now, we're enforcing light mode for consistency
  return 'light';
}

// Alternative implementation if we want to support system theme in the future:
/*
export function useColorScheme(): ColorScheme {
  const systemColorScheme = useNativeColorScheme();
  
  // You can add logic here to:
  // - Override based on user preferences
  // - Handle system theme changes
  // - Add persistence
  
  return systemColorScheme;
}
*/