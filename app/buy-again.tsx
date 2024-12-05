import React from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCartContext } from '@/providers/CartProvider';
import { SearchHeader } from '@/components/SearchHeader';

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
    }
  };

  const renderOrderItem = ({ item }: any) => (
    <ThemedView style={[styles.orderCard, { backgroundColor: colors.cardBackground }]}>
      <Pressable
        style={styles.productInfo}
        onPress={() => router.push(`/product/${item.productId}`)}>
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require('@/assets/images/partial-react-logo.png')
          }
          style={styles.productImage}
        />
        <ThemedView style={styles.productDetails}>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.shopName, { color: colors.link }]}>
            {item.shop_name}
          </ThemedText>
          <ThemedText style={styles.orderDate}>
            Ordered on {new Date(item.order_date).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </Pressable>

      <ThemedView style={styles.actions}>
        <Pressable
          style={[styles.buyButton, { backgroundColor: colors.secondary }]}
          onPress={() => handleBuyAgain(item.productId)}>
          <ThemedText style={styles.buyButtonText}>Buy it again</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.viewButton, { borderColor: colors.border }]}
          onPress={() => router.push(`/product/${item.productId}`)}>
          <ThemedText style={[styles.viewButtonText, { color: colors.link }]}>
            View item
          </ThemedText>
        </Pressable>
      </ThemedView>
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
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ title: 'Buy Again' }} />
        <IconSymbol name="bag" size={64} color={colors.icon} />
        <ThemedText style={styles.emptyTitle}>No purchase history</ThemedText>
        <ThemedText style={styles.emptyText}>
          Items you've purchased will appear here for easy reordering
        </ThemedText>
        <Pressable
          style={[styles.browseButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/explore')}>
          <ThemedText style={styles.browseButtonText}>Start Shopping</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Buy Again' }} />
      <SearchHeader />

      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
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
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 12,
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
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  buyButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
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