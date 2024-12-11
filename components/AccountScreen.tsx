import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session, signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [session?.user]);

  const dummyData = {
    name: profile?.full_name || "Rhett Jorgensen",
    email: profile?.email || session?.user?.email || "rhettjorg@gmail.com",
    phone: profile?.contact_phone || "+1 (555) 123-4567",
    memberSince: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "March 2024",
    totalOrders: 12, // This would be fetched from orders table
    rewardPoints: 450, // This would be calculated based on user activity
    savedAddresses: 2, // This would be fetched from addresses table
    paymentMethods: 3, // This would be fetched from payment methods table
  };

  const menuItems = [
    { 
      title: 'My Orders', 
      icon: 'list.bullet', 
      route: '/orders',
      badge: dummyData.totalOrders.toString(),
      subtitle: 'View order history and track deliveries'
    },
    { 
      title: 'Saved Addresses', 
      icon: 'location', 
      route: '/addresses',
      badge: dummyData.savedAddresses.toString(),
      subtitle: 'Manage delivery addresses'
    },
    { 
      title: 'Payment Methods', 
      icon: 'creditcard', 
      route: '/payment-methods',
      badge: dummyData.paymentMethods.toString(),
      subtitle: 'Manage your payment options'
    },
    { 
      title: 'Notifications', 
      icon: 'bell', 
      route: '/notifications',
      badge: '3',
      subtitle: 'Update your notification preferences'
    },
    { 
      title: 'Help & Support', 
      icon: 'questionmark.circle', 
      route: '/support',
      subtitle: 'Get help with your orders'
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Image 
              source={{ uri: profile?.avatar_url || 'https://ui-avatars.com/api/?name=Alex+Thompson&background=random' }}
              style={styles.avatar}
            />
          </ThemedView>
          <ThemedView style={styles.profileInfo}>
            <ThemedText style={[styles.userName, { color: colors.text }]}>
              {dummyData.name}
            </ThemedText>
            <ThemedText style={[styles.userEmail, { color: colors.mediumGray }]}>
              {dummyData.email}
            </ThemedText>
            <ThemedText style={[styles.userPhone, { color: colors.mediumGray }]}>
              {dummyData.phone}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={[styles.statsContainer, { borderColor: colors.border }]}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {dummyData.totalOrders}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.mediumGray }]}>
              Orders
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {dummyData.rewardPoints}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.mediumGray }]}>
              Points
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={[styles.statValue, { color: colors.text }]}>
              {dummyData.memberSince}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.mediumGray }]}>
              Member Since
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.menuSection, { backgroundColor: colors.cardBackground }]}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.title}
            style={[
              styles.menuItem,
              index !== menuItems.length - 1 && styles.menuItemBorder,
              { borderColor: colors.border }
            ]}
            onPress={() => router.push(item.route)}
          >
            <ThemedView style={styles.menuItemContent}>
              <ThemedView style={[styles.menuIconContainer, { backgroundColor: colors.background }]}>
                <IconSymbol name={item.icon} size={24} color={colors.primary} />
              </ThemedView>
              <ThemedView style={styles.menuTextContainer}>
                <ThemedText style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </ThemedText>
                <ThemedText style={[styles.menuItemSubtext, { color: colors.mediumGray }]}>
                  {item.subtitle}
                </ThemedText>
              </ThemedView>
              {item.badge && (
                <ThemedView style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                </ThemedView>
              )}
              <IconSymbol name="chevron.right" size={20} color={colors.mediumGray} />
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>

      <ThemedView style={[styles.signOutSection, { backgroundColor: colors.cardBackground }]}>
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="secondary"
          size="large"
          fullWidth
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 10,
  },
  menuSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signOutSection: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
}); 