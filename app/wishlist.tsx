import React, { useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useWishlistContext } from '@/providers/WishlistProvider';
import { useCartContext } from '@/providers/CartProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function WishlistScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, loading, removeFromWishlist } = useWishlistContext();
  const { addItem } = useCartContext();

  const handleMoveToCart = useCallback(async (item: any) => {
    try {
      await addItem(item.product_id);
      await removeFromWishlist(item.product_id);
      // Could add a success toast here
    } catch (error) {
      console.error('Error moving item to cart:', error);
      // Could add an error toast here
    }
  }, [addItem, removeFromWishlist]);

  const renderEmptyState = () => (
    <ThemedView style={styles.centered}>
      <Stack.Screen options={{ title: 'Wishlist' }} />
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="heart" size={64} color={colors.icon} />
        <LinearGradient
          colors={['transparent', colors.background]}
          style={styles.iconGradient}
        />
      </View>
      <ThemedText style={styles.emptyTitle}>Your wishlist is empty</ThemedText>
      <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
        Save items you want to buy later by tapping the heart icon on any product
      </ThemedText>
      <Pressable
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <IconSymbol name="magnifyingglass" size={20} color="#FFFFFF" />
        <ThemedText style={styles.browseButtonText}>Browse Products</ThemedText>
      </Pressable>
    </ThemedView>
  );

  const renderItem = ({ item }: any) => (
    <Pressable
      style={[styles.card, { backgroundColor: colors.background }]}
      onPress={() => router.push(`/product/${item.product_id}`)}
    >
      <Image
        source={
          item.product.image_url
            ? { uri: item.product.image_url }
            : require('@/assets/images/partial-react-logo.png')
        }
        style={styles.image}
        defaultSource={require('@/assets/images/partial-react-logo.png')}
      />
      
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.product.name}
        </ThemedText>
        
        <ThemedText style={[styles.price, { color: colors.priceRed }]}>
          ${item.product.price.toFixed(2)}
        </ThemedText>
        
        {item.product.shop && (
          <ThemedText style={[styles.shop, { color: colors.textSecondary }]}>
            Sold by {item.product.shop.name}
          </ThemedText>
        )}

        {/* Stock Status */}
        <ThemedText 
          style={[
            styles.stockStatus, 
            { color: item.product.in_stock ? colors.success : colors.error }
          ]}
        >
          {item.product.in_stock ? 'In Stock' : 'Out of Stock'}
        </ThemedText>
        
        <ThemedView style={styles.actions}>
          <Pressable
            style={[styles.moveToCartButton, { backgroundColor: colors.secondary }]}
            onPress={() => handleMoveToCart(item)}
            disabled={!item.product.in_stock}
          >
            <IconSymbol name="cart.badge.plus" size={20} color="#000000" />
            <ThemedText style={styles.moveToCartText}>Move to Cart</ThemedText>
          </Pressable>
          
          <Pressable
            style={[styles.removeButton, { borderColor: colors.border }]}
            onPress={() => removeFromWishlist(item.product_id)}
          >
            <IconSymbol name="trash" size={20} color={colors.error} />
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Wishlist',
          headerRight: items.length > 0 ? () => (
            <Pressable onPress={() => items.forEach(item => handleMoveToCart(item))}>
              <ThemedText style={[styles.moveAllText, { color: colors.link }]}>
                Move All to Cart
              </ThemedText>
            </Pressable>
          ) : undefined
        }} 
      />
      
      {items.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 22,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  shop: {
    fontSize: 14,
    marginBottom: 8,
  },
  stockStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  moveToCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  separator: {
    height: 12,
  },
  moveAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 16,
  },
});