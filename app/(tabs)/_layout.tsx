import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.headerBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
          height: Platform.OS === 'ios' ? 96 : 64, // Adjusted for iOS notch
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: '600',
          fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
        },
        headerTitleAlign: 'center',
        headerTintColor: '#FFFFFF',
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: colors.surfaceBackground,
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64, // Adjusted for iPhone home indicator
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
        },
        tabBarIconStyle: {
          marginBottom: -4, // Tighten up space between icon and label
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'MainStreet Markets',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size} 
              name="house.fill" 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Browse',
          headerTitle: 'Browse Local Shops',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size} 
              name="list.bullet" 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'Shopping Cart',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size} 
              name="cart.fill" 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'Your Account',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              size={size} 
              name="person.fill" 
              color={color}
            />
          ),
          headerRight: () => (
            <IconSymbol
              name="gear"
              size={24}
              color="#FFFFFF"
              style={{ marginRight: 16 }}
              onPress={() => router.push('/settings')}
            />
          ),
        }}
      />
    </Tabs>
  );
}