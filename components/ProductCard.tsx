import { StyleSheet, Pressable, Image, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useWishlistContext } from '@/providers/WishlistProvider';
import { Product } from '@/lib/supabase';
import { useState, useCallback } from 'react';
import type { GestureResponderEvent } from 'react-native';

type Props = {
  product: Product & {
    shop?: {
      name: string;
      rating: number;
    };
  };
  variant?: 'grid' | 'list';
};

export function ProductCard({ product, variant = 'grid' }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));
  const [imageError, setImageError] = useState(false);

  const handleWishlist = useCallback(async (e: GestureResponderEvent) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  }, [inWishlist, product.id, toggleWishlist]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (variant === 'list') {
    return (
      <Pressable
        style={[styles.listCard, { backgroundColor: colors.background }]}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <View style={styles.listImageContainer}>
          <Image 
            source={
              !imageError && product.image_url
                ? { uri: product.image_url }
                : require('@/assets/images/partial-react-logo.png')
            }
            style={styles.listImage}
            onError={handleImageError}
          />
          <Pressable 
            style={[styles.wishlistButton, { backgroundColor: colors.background }]} 
            onPress={handleWishlist}
          >
            <IconSymbol
              name={inWishlist ? 'heart.fill' : 'heart'}
              size={20}
              color={inWishlist ? colors.error : colors.icon}
            />
          </Pressable>
        </View>

        <ThemedView style={styles.listContent}>
          <ThemedText style={styles.name} numberOfLines={2}>
            {product.name}
          </ThemedText>
          <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
          
          {product.shop && (
            <ThemedView style={styles.shopInfo}>
              <ThemedText style={styles.shopName} numberOfLines={1}>
                {product.shop.name}
              </ThemedText>
              <ThemedView style={styles.rating}>
                <IconSymbol name="star.fill" size={12} color={colors.ratingStars} />
                <ThemedText style={styles.ratingText}>
                  {product.shop.rating.toFixed(1)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.gridCard, { backgroundColor: colors.background }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View style={styles.gridImageContainer}>
        <Image 
          source={
            !imageError && product.image_url
              ? { uri: product.image_url }
              : require('@/assets/images/partial-react-logo.png')
          }
          style={styles.gridImage}
          onError={handleImageError}
        />
        <Pressable 
          style={[styles.wishlistButton, { backgroundColor: colors.background }]} 
          onPress={handleWishlist}
        >
          <IconSymbol
            name={inWishlist ? 'heart.fill' : 'heart'}
            size={20}
            color={inWishlist ? colors.error : colors.icon}
          />
        </Pressable>
      </View>

      <ThemedView style={styles.gridContent}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.price}>${product.price.toFixed(2)}</ThemedText>
        
        {product.shop && (
          <ThemedView style={styles.shopInfo}>
            <ThemedText style={styles.shopName} numberOfLines={1}>
              {product.shop.name}
            </ThemedText>
            <ThemedView style={styles.rating}>
              <IconSymbol name="star.fill" size={12} color={colors.ratingStars} />
              <ThemedText style={styles.ratingText}>
                {product.shop.rating.toFixed(1)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {product.discount && (
          <ThemedView style={[styles.discountBadge, { backgroundColor: colors.saveBadge }]}>
            <ThemedText style={styles.discountText}>{product.discount}% OFF</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridContent: {
    padding: 12,
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  listImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#B12704', // Amazon-style price color
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});