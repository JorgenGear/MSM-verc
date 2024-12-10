import React, { useState } from 'react';
import { StyleSheet, Image, Pressable, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  shop_name: string;
  category?: string;
  discount?: number;
};

export function ProductCard({ id, name, price, image_url, shop_name, category, discount }: ProductCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [imageError, setImageError] = useState(false);

  const getPlaceholderImage = () => {
    if (category) {
      return require(`@/assets/images/categories/${category.toLowerCase()}.jpg`);
    }
    return require('@/assets/images/placeholders/product-default.jpg');
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.productCardBackground }]}
      onPress={() => router.push(`/product/${id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageError ? getPlaceholderImage() : { uri: image_url }}
          style={styles.image}
          onError={() => setImageError(true)}
        />
        {discount && discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: colors.saveBadge }]}>
            <ThemedText style={styles.discountText}>{discount}% OFF</ThemedText>
          </View>
        )}
      </View>

      <ThemedView style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {name}
        </ThemedText>
        
        <ThemedText style={[styles.price, { color: colors.priceRed }]}>
          ${price.toFixed(2)}
        </ThemedText>

        <ThemedText style={[styles.shop, { color: colors.textSecondary }]} numberOfLines={1}>
          {shop_name}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  name: {
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