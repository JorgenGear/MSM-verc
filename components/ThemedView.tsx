import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { ViewProps } from 'react-native';
import type { ThemeProps } from '@/lib/types';

/**
 * A themed view component that automatically handles background colors
 * and styling based on the current theme.
 */
interface Props extends ViewProps, ThemeProps {}

export function ThemedView(props: Props) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, 
    'background'
  );

  return (
    <View 
      style={[{ backgroundColor }, style]} 
      {...otherProps} 
    />
  );
}