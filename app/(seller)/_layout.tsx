import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export default function SellerLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/(tabs)')}
            style={{ marginRight: 15 }}>
            <IconSymbol name="house.fill" size={24} color="#FFFFFF" />
          </Pressable>
        ),
      }}>
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Seller Dashboard',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ marginLeft: 15 }}>
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: 'Manage Products',
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Manage Orders',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Seller Profile',
        }}
      />
      <Stack.Screen
        name="onboarding"
        options={{
          title: 'Become a Seller',
          headerShown: false,
        }}
      />
    </Stack>
  );
} 