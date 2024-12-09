import { StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';
import { useProducts } from '@/hooks/useProducts';
import { useShops } from '@/hooks/useShops';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { Product } from '@/lib/supabase';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading: productsLoading, getProductsByCategory, refreshProducts } = useProducts();
  const { shops, loading: shopsLoading, refreshShops } = useShops();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'All',
    'Local Shops',
    'Handmade',
    'Food',
    'Services',
    'Crafts',
  ];

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      getProductsByCategory(category);
    }
  }, [getProductsByCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshProducts(), refreshShops()]);
    setRefreshing(false);
  }, [refreshProducts, refreshShops]);

  const renderProductCard = (product: Product) => (
    <Pressable 
      key={product.id}
      style={[styles.productCard, { backgroundColor: colors.productCardBackground }]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        defaultSource={require('@/assets/images/partial-react-logo.png')}
      />
      <ThemedView style={styles.productInfo}>
        <ThemedText style={styles.productTitle} numberOfLines={2}>
          {product.name}
        </ThemedText>
        
        {product.shop && (
          <ThemedView style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color={colors.ratingStars} />
            <ThemedText style={styles.rating}>
              {product.shop.rating.toFixed(1)}
            </ThemedText>
            <ThemedText style={styles.shopName} numberOfLines={1}>
              {product.shop.name}
            </ThemedText>
          </ThemedView>
        )}

        {product.local_pickup && (
          <ThemedText style={[styles.pickupBadge, { color: colors.success }]}>
            Local Pickup Available
          </ThemedText>
        )}

        <ThemedText style={[styles.price, { color: colors.priceRed }]}>
          ${product.price.toFixed(2)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );

  if (productsLoading || shopsLoading) {
    return (
      <ThemedView style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      <SearchHeader />

      {/* Filter Bar */}
      <ThemedView style={[styles.filterBar, { borderColor: colors.border }]}>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="line.3.horizontal.decrease" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>
            Filter
          </ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="arrow.up.arrow.down" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>
            Sort
          </ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="map" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>
            Map View
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <Pressable 
            key={category}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryChip,
              { 
                backgroundColor: category === selectedCategory ? colors.primary : colors.categoryButtonBackground,
                borderColor: colors.border,
              }
            ]}
          >
            <ThemedText 
              style={[
                styles.categoryChipText,
                { color: category === selectedCategory ? '#FFFFFF' : colors.text }
              ]}
            >
              {category}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results Count */}
      <ThemedText style={[styles.resultsCount, { color: colors.textSecondary }]}>
        {products.length} results in Logan, UT
      </ThemedText>

      {/* Product Grid */}
      <ThemedView style={styles.productGrid}>
        {products.map(renderProductCard)}
      </ThemedView>

      {/* Featured Shops */}
      {shops.length > 0 && (
        <ThemedView style={[styles.section, { borderColor: colors.border }]}>
          <ThemedText style={styles.sectionTitle}>Featured Local Shops</ThemedText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shopsContent}
          >
            {shops.map((shop) => (
              <Pressable 
                key={shop.id} 
                style={[styles.shopCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => router.push(`/shop/${shop.id}`)}
              >
                <Image
                  source={{ uri: shop.image_url }}
                  style={styles.shopImage}
                  defaultSource={require('@/assets/images/partial-react-logo.png')}
                />
                <ThemedText style={styles.shopCardName}>{shop.name}</ThemedText>
                <ThemedView style={styles.shopRating}>
                  <IconSymbol name="star.fill" size={16} color={colors.ratingStars} />
                  <ThemedText style={styles.shopRatingText}>
                    {shop.rating.toFixed(1)}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>
      )}
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
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesScroll: {
    marginVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  productGrid: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    marginRight: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  shopName: {
    flex: 1,
    fontSize: 14,
    opacity: 0.7,
  },
  pickupBadge: {
    fontSize: 12,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  shopsContent: {
    paddingRight: 16,
  },
  shopCard: {
    width: 160,
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shopImage: {
    width: '100%',
    height: 100,
  },
  shopCardName: {
    fontSize: 16,
    fontWeight: '500',
    padding: 12,
    paddingBottom: 8,
  },
  shopRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  shopRatingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});