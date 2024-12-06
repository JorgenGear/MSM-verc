import { StyleSheet, ScrollView, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';
import { useProducts } from '@/hooks/useProducts';
import { useShops } from '@/hooks/useShops';
import { useState, useCallback } from 'react';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading: productsLoading, getProductsByCategory } = useProducts();
  const { shops, loading: shopsLoading } = useShops();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Local Shops', 'Handmade', 'Food', 'Services', 'Crafts'];

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      getProductsByCategory(category);
    }
  }, [getProductsByCategory]);

  const renderProductCard = (product: any) => (
    <Pressable 
      key={product.id}
      style={[styles.productCard, { backgroundColor: colors.productCardBackground }]}
      onPress={() => router.push(`/product/${product.id}`)}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
      />
      <ThemedView style={[styles.productInfo, { backgroundColor: colors.productCardBackground }]}>
        <ThemedText style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedView style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={16} color={colors.ratingStars} />
          <ThemedText style={[styles.rating, { color: colors.text }]}>{product.shop?.rating}</ThemedText>
          <ThemedText style={[styles.reviews, { color: colors.text }]}>({product.shop?.name})</ThemedText>
        </ThemedView>
        <ThemedText style={[styles.primeEligible, { color: colors.success }]}>
          Eligible for Local Pickup
        </ThemedText>
        <ThemedText style={[styles.price, { color: colors.text }]}>${product.price}</ThemedText>
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchHeader />

      {/* Filter Bar */}
      <ThemedView 
        style={[
          styles.filterBar, 
          { 
            borderColor: colors.border,
            backgroundColor: colors.background 
          }
        ]}>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="line.3.horizontal.decrease" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>Filter</ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="arrow.up.arrow.down" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>Sort</ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="map" size={20} color={colors.text} />
          <ThemedText style={[styles.filterText, { color: colors.text }]}>Map View</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Categories Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map((category, index) => (
          <Pressable 
            key={index} 
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryChip,
              { 
                backgroundColor: category === selectedCategory ? colors.primary : colors.categoryButtonBackground,
                borderWidth: 1,
                borderColor: colors.border,
              }
            ]}>
            <ThemedText style={[
              styles.categoryChipText,
              { color: category === selectedCategory ? '#FFFFFF' : colors.text }
            ]}>
              {category}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results Count */}
      <ThemedText style={[styles.resultsCount, { color: colors.text }]}>
        {products.length} results in your area
      </ThemedText>

      {/* Product Grid */}
      <ThemedView style={[styles.productGrid, { backgroundColor: colors.background }]}>
        {products.map(product => renderProductCard(product))}
      </ThemedView>

      {/* Featured Shops */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Featured Local Shops</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shops.map((shop) => (
            <Pressable 
              key={shop.id} 
              style={[styles.shopCard, { backgroundColor: colors.productCardBackground }]}>
              <Image
                source={{ uri: shop.image_url }}
                style={styles.shopImage}
              />
              <ThemedText style={[styles.shopName, { color: colors.text }]}>{shop.name}</ThemedText>
              <ThemedView style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={16} color={colors.ratingStars} />
                <ThemedText style={[styles.rating, { color: colors.text }]}>{shop.rating}</ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ScrollView>
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
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterText: {
    fontSize: 14,
  },
  categoriesScroll: {
    marginVertical: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsCount: {
    fontSize: 14,
    opacity: 0.7,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  productGrid: {
    padding: 8,
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 14,
    opacity: 0.7,
  },
  primeEligible: {
    fontSize: 12,
    color: '#007600',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
  },
  section: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#dddddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  shopCard: {
    width: 160,
    marginRight: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  shopImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
});
