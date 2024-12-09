import React from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCartContext } from '@/providers/CartProvider';
import { SearchHeader } from '@/components/SearchHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function BuyAgainScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { orderHistory, loading, addItem } = useCartContext();

  const handleBuyAgain = async (productId: string) => {
    try {
      await addItem(productId);
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Could add error toast here
    }
  };

  const renderEmptyState = () => (
    <ThemedView style={styles.centered}>
      <Stack.Screen options={{ title: 'Buy Again' }} />
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="bag" size={64} color={colors.icon} />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={styles.iconGradient}
        />
      </View>
      <ThemedText style={styles.emptyTitle}>No purchase history</ThemedText>
      <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
        Items you've purchased will appear here for easy reordering
      </ThemedText>
      <Pressable
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <IconSymbol name="magnifyingglass" size={20} color="#FFFFFF" />
        <ThemedText style={styles.browseButtonText}>Start Shopping</ThemedText>
      </Pressable>
    </ThemedView>
  );

  const renderOrderItem = ({ item }: any) => (
    <ThemedView style={[styles.orderCard, { backgroundColor: colors.cardBackground }]}>
      <Pressable
        style={styles.productInfo}
        onPress={() => router.push(`/product/${item.productId}`)}
      >
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require('@/assets/images/partial-react-logo.png')
          }
          style={styles.productImage}
          defaultSource={require('@/assets/images/partial-react-logo.png')}
        />
        <ThemedView style={styles.productDetails}>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.shopName, { color: colors.link }]}>
            {item.shop_name}
          </ThemedText>
          <ThemedText style={[styles.orderDate, { color: colors.textSecondary }]}>
            Ordered on {new Date(item.order_date).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </Pressable>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.03)']}
        style={styles.actionGradient}
      >
        <ThemedView style={styles.actions}>
          <Pressable
            style={[styles.buyButton, { backgroundColor: colors.secondary }]}
            onPress={() => handleBuyAgain(item.productId)}
          >
            <IconSymbol name="cart.badge.plus" size={20} color="#000000" />
            <ThemedText style={styles.buyButtonText}>Buy it again</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.viewButton, { borderColor: colors.border }]}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <ThemedText style={[styles.viewButtonText, { color: colors.link }]}>
              View item
            </ThemedText>
          </Pressable>
        </ThemedView>
      </LinearGradient>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!orderHistory?.length) {
    return renderEmptyState();
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Buy Again' }} />
      <SearchHeader />

      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  orderCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 22,
  },
  shopName: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
  },
  actionGradient: {
    paddingTop: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
});