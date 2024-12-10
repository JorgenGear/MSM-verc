import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
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
    { title: 'Your Account', icon: 'person.fill', route: '/account-settings' },
    { title: 'Customer Service', icon: 'questionmark.circle.fill', route: '/support' },
    ...(isSeller ? [
      { title: 'Seller Dashboard', icon: 'building.2.fill', route: '/(seller)/dashboard' }
    ] : [
      { title: 'Become a Seller', icon: 'building.2.fill', route: '/(seller)/onboarding' }
    ]),
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Account Information */}
      {user && (
        <View style={styles.accountInfoSection}>
          <View style={[styles.card, styles.infoCard]}>
            <View>
              <ThemedText style={styles.labelText}>Email Address</ThemedText>
              <ThemedText style={styles.valueText}>{user.email}</ThemedText>
            </View>
            <Pressable
              onPress={signOut}
              style={styles.signOutButton}
            >
              <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
            </Pressable>
          </View>
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Pressable 
            key={index}
            style={[styles.card, styles.menuItem]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}>
                <IconSymbol 
                  name={item.icon} 
                  size={24} 
                  color={colors.primary}
                />
              </View>
              <ThemedText style={styles.menuItemText}>
                {item.title}
              </ThemedText>
            </View>
            <IconSymbol 
              name="chevron.right" 
              size={20} 
              color={colors.text}
            />
          </Pressable>
        ))}
      </View>

      {/* Account Security Section */}
      {user && (
        <View style={styles.securitySection}>
          <View style={[styles.card, styles.securityCard]}>
            <View>
              <ThemedText style={styles.labelText}>Account Security</ThemedText>
              <ThemedText style={styles.valueText}>
                Password • Two-factor authentication
              </ThemedText>
            </View>
            <Pressable onPress={() => router.push('/account-settings')}>
              <ThemedText style={styles.manageText}>Manage</ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F8F3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  labelText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1A4D2E',
  },
  signOutText: {
    color: '#1A4D2E',
    fontWeight: '500',
  },
  manageText: {
    color: '#1A4D2E',
    fontWeight: '500',
  },
  securityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});