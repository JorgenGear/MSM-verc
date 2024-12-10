import { Tabs, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mediumGray,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="magnifyingglass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person" size={size} color={color} />
          ),
        }}
      />
      {/* Hidden tabs for nested screens */}
      <Tabs.Screen
        name="orders"
        options={{
          href: null, // This makes the tab not show in the bar
          title: 'My Orders',
        }}
      />
      <Tabs.Screen
        name="addresses"
        options={{
          href: null,
          title: 'Saved Addresses',
        }}
      />
      <Tabs.Screen
        name="payment-methods"
        options={{
          href: null,
          title: 'Payment Methods',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: 'Notifications',
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          href: null,
          title: 'Help & Support',
        }}
      />
      <Tabs.Screen
        name="daily-deals"
        options={{
          href: null,
          title: 'Daily Deals',
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null,
          title: 'Product Details',
        }}
      />
    </Tabs>
  );
}