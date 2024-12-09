import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, signOut } = useAuth();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    if (user) {
      checkSellerStatus();
    }
  }, [user]);

  const checkSellerStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_seller')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsSeller(data?.is_seller || false);
    } catch (error) {
      console.error('Error checking seller status:', error);
    }
  };

  const menuItems = [
    { title: 'Your Orders', icon: 'box.fill', route: '/orders' },
    { title: 'Buy Again', icon: 'arrow.clockwise', route: '/buy-again' },
    { title: 'Your Lists', icon: 'list.bullet', route: '/lists' },
    { title: 'Your Account', icon: 'person.fill', route: '/account-settings' },
    { title: 'Customer Service', icon: 'questionmark.circle.fill', route: '/support' },
    ...(isSeller ? [
      { title: 'Seller Dashboard', icon: 'building.2.fill', route: '/(seller)/dashboard' }
    ] : [
      { title: 'Become a Seller', icon: 'building.2.fill', route: '/(seller)/onboarding' }
    ]),
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.header, { backgroundColor: colors.productCardBackground }]}>
        <ThemedText style={[styles.greeting, { color: colors.text }]}>
          Hello, {user?.email || 'Guest'}
        </ThemedText>
        {user ? (
          <Pressable style={styles.signOutButton} onPress={signOut}>
            <ThemedText style={[styles.signOutText, { color: colors.link }]}>Sign Out</ThemedText>
          </Pressable>
        ) : (
          <Pressable style={styles.signInButton} onPress={() => router.push('/login')}>
            <ThemedText style={[styles.signInText, { color: colors.link }]}>Sign In</ThemedText>
          </Pressable>
        )}
      </ThemedView>

      <ThemedView style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <AnimatedTransition key={index} type="fadeInSlide" delay={index * 100}>
            <Pressable
              style={[
                styles.menuItem,
                {
                  backgroundColor: colors.productCardBackground,
                  borderColor: colors.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }
              ]}
              onPress={() => router.push(item.route)}>
              <ThemedView style={styles.menuItemContent}>
                <IconSymbol name={item.icon} size={24} color={colors.text} />
                <ThemedText style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </ThemedText>
              </ThemedView>
              <IconSymbol name="chevron.right" size={20} color={colors.text} />
            </Pressable>
          </AnimatedTransition>
        ))}
      </ThemedView>

      {user && (
        <ThemedView style={styles.accountInfo}>
          <ThemedText style={[styles.accountInfoTitle, { color: colors.text }]}>
            Account Information
          </ThemedText>
          <ThemedView style={[styles.accountInfoCard, { backgroundColor: colors.productCardBackground }]}>
            <ThemedText style={[styles.accountInfoLabel, { color: colors.text }]}>Email</ThemedText>
            <ThemedText style={[styles.accountInfoValue, { color: colors.text }]}>
              {user.email}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    fontSize: 16,
  },
  signInButton: {
    padding: 8,
  },
  signInText: {
    fontSize: 16,
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountInfo: {
    padding: 16,
    marginTop: 24,
  },
  accountInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  accountInfoCard: {
    padding: 16,
    borderRadius: 8,
  },
  accountInfoLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  accountInfoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 