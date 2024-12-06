import React from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useWishlistContext } from '@/providers/WishlistProvider';
import { useCartContext } from '@/providers/CartProvider';

export default function WishlistScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, loading, removeFromWishlist } = useWishlistContext();
  const { addItem } = useCartContext();

  const handleMoveToCart = async (item: any) => {
    try {
      await addItem(item.product_id);
      await removeFromWishlist(item.product_id);
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
  };

  const renderItem = ({ item }: any) => (
    <ThemedView style={[styles.card, { backgroundColor: colors.background }]}>
      <Pressable onPress={() => router.push(`/product/${item.product_id}`)}>
        <Image
          source={
            item.product.image_url
              ? { uri: item.product.image_url }
              : require('@/assets/images/partial-react-logo.png')
          }
          style={styles.image}
        />
      </Pressable>
      <ThemedView style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.product.name}
        </ThemedText>
        <ThemedText style={styles.price}>${item.product.price}</ThemedText>
        <ThemedText style={styles.shop}>
          Sold by {item.product.shop.name}
        </ThemedText>
        
        <ThemedView style={styles.actions}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={() => handleMoveToCart(item)}>
            <ThemedText style={styles.buttonText}>Move to Cart</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.background }]}
            onPress={() => removeFromWishlist(item.product_id)}>
            <IconSymbol name="trash" size={20} color={colors.error} />
          </Pressable>
        </ThemedView>
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

  if (items.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <Stack.Screen options={{ title: 'Wishlist' }} />
        <IconSymbol name="heart" size={64} color={colors.icon} />
        <ThemedText style={styles.emptyTitle}>Your wishlist is empty</ThemedText>
        <ThemedText style={styles.emptyText}>
          Save items you want to buy later by tapping the heart icon on any product
        </ThemedText>
        <Pressable
          style={[styles.browseButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/explore')}>
          <ThemedText style={styles.browseButtonText}>Browse Products</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Wishlist' }} />
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    textAlign: 'center',
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
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  shop: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  separator: {
    height: 12,
  },
}); 