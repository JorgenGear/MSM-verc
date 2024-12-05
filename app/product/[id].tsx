import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCartContext } from '@/providers/CartProvider';
import { useWishlistContext } from '@/providers/WishlistProvider';
import { useProductDetails } from '@/hooks/useProductDetails';
import { ProductReviews } from '@/components/ProductReviews';

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const {
    product,
    relatedProducts,
    loading,
    error,
    addReview,
    getAverageRating,
    getRatingCounts,
  } = useProductDetails(id as string);
  const { addItem } = useCartContext();
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (product) {
      setInWishlist(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product.id);
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={colors.error} />
        <ThemedText style={styles.errorText}>
          {error || 'Product not found'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      {product.image_url && (
        <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
      )}

      <ThemedView style={styles.content}>
        {/* Product Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.name}>{product.name}</ThemedText>
            <ThemedText style={styles.price}>${product.price}</ThemedText>
          </ThemedView>
          <Pressable onPress={handleToggleWishlist}>
            <IconSymbol
              name={inWishlist ? 'heart.fill' : 'heart'}
              size={24}
              color={inWishlist ? colors.error : colors.icon}
            />
          </Pressable>
        </ThemedView>

        {/* Shop Info */}
        <Pressable
          style={styles.shopContainer}
          onPress={() => router.push(`/shop/${product.shop.id}`)}>
          <ThemedView style={styles.shopInfo}>
            <ThemedText style={styles.shopName}>{product.shop.name}</ThemedText>
            <ThemedView style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={16} color={colors.secondary} />
              <ThemedText style={styles.rating}>{product.shop.rating.toFixed(1)}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.location}>{product.shop.location}</ThemedText>
        </Pressable>

        {/* Product Description */}
        <ThemedText style={styles.description}>{product.description}</ThemedText>

        {/* Quantity Selector */}
        <ThemedView style={styles.quantityContainer}>
          <ThemedText style={styles.label}>Quantity:</ThemedText>
          <ThemedView style={styles.quantityControls}>
            <Pressable
              style={[styles.quantityButton, { backgroundColor: colors.primary }]}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}>
              <IconSymbol name="minus" size={20} color="#ffffff" />
            </Pressable>
            <ThemedText style={styles.quantity}>{quantity}</ThemedText>
            <Pressable
              style={[styles.quantityButton, { backgroundColor: colors.primary }]}
              onPress={() => quantity < product.stock && setQuantity(quantity + 1)}>
              <IconSymbol name="plus" size={20} color="#ffffff" />
            </Pressable>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.stock}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </ThemedText>

        {/* Add to Cart Button */}
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}>
          <IconSymbol name="cart.badge.plus" size={24} color="#ffffff" />
          <ThemedText style={styles.addButtonText}>Add to Cart</ThemedText>
        </Pressable>

        {/* Reviews Section */}
        <ProductReviews
          reviews={product.reviews}
          averageRating={getAverageRating()}
          ratingCounts={getRatingCounts()}
          onAddReview={addReview}
        />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ThemedView style={styles.relatedProducts}>
            <ThemedText style={styles.relatedTitle}>Related Products</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((relatedProduct) => (
                <Pressable
                  key={relatedProduct.id}
                  style={[styles.relatedCard, { backgroundColor: colors.background }]}
                  onPress={() => router.push(`/product/${relatedProduct.id}`)}>
                  {relatedProduct.image_url && (
                    <Image
                      source={{ uri: relatedProduct.image_url }}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                  )}
                  <ThemedView style={styles.relatedInfo}>
                    <ThemedText style={styles.relatedName} numberOfLines={2}>
                      {relatedProduct.name}
                    </ThemedText>
                    <ThemedText style={styles.relatedPrice}>
                      ${relatedProduct.price}
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              ))}
            </ScrollView>
          </ThemedView>
        )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 16,
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
  },
  shopContainer: {
    marginBottom: 20,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
  },
  location: {
    fontSize: 14,
    opacity: 0.7,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  stock: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedProducts: {
    marginTop: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  relatedCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 160,
  },
  relatedInfo: {
    padding: 12,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  relatedPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 