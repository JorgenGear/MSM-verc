import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useBackground?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, useBackground = true, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    useBackground ? 'surfaceBackground' : 'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
