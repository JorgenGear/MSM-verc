import { StyleSheet, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function SellerDashboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!session?.user) {
      router.replace('/(auth)/login');
      return;
    }

    loadSellerData();
  }, [session]);

  const loadSellerData = async () => {
      setLoading(true);
      const { data: shops, error: sellerError } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', session?.user?.id)
        .single();

      if (sellerError || !shops) {
        router.replace('/(seller)/onboarding');
        return;
      }

      // Load seller statistics
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('shop_id', shops.id);

      setStats({
        totalProducts: products?.length || 0,
        totalOrders: 0,
        totalRevenue: 5,
        averageRating: 3,
      });
  }

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>Seller Dashboard</ThemedText>
      </ThemedView>

      {/* Quick Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedView style={[styles.statCard, { backgroundColor: colors.background }]}>
          <IconSymbol name="cube.box.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.statValue}>{stats.totalProducts}</ThemedText>
          <ThemedText style={styles.statLabel}>Products</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: colors.background }]}>
          <IconSymbol name="bag.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.statValue}>{stats.totalOrders}</ThemedText>
          <ThemedText style={styles.statLabel}>Orders</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: colors.background }]}>
          <IconSymbol name="dollarsign.circle.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.statValue}>${stats.totalRevenue}</ThemedText>
          <ThemedText style={styles.statLabel}>Revenue</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: colors.background }]}>
          <IconSymbol name="star.fill" size={24} color={colors.secondary} />
          <ThemedText style={styles.statValue}>{stats.averageRating.toFixed(1)}</ThemedText>
          <ThemedText style={styles.statLabel}>Rating</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Quick Actions */}
      <ThemedView style={styles.actionsContainer}>
        <Pressable 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/products/NewProductScreen')}>
          <IconSymbol name="plus" size={20} color="#ffffff" />
          <ThemedText style={styles.actionButtonText}>Add Product</ThemedText>
        </Pressable>

        <Pressable 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(seller)/profile')}>
          <IconSymbol name="gear" size={20} color="#ffffff" />
          <ThemedText style={styles.actionButtonText}>Settings</ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  orderCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 