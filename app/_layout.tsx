import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from '@/providers/CartProvider';
import { WishlistProvider } from '@/providers/WishlistProvider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="checkout" 
                options={{ 
                  title: 'Checkout',
                  headerBackTitle: 'Back',
                }} 
              />
              <Stack.Screen 
                name="checkout/success" 
                options={{ 
                  title: 'Order Confirmed',
                  gestureEnabled: false,
                  headerBackVisible: false,
                }} 
              />
            </Stack>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}