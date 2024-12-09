import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProductSearch, ProductFilter } from '@/hooks/useProductSearch';
import { LinearGradient } from 'expo-linear-gradient';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
];

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading, totalCount, searchProducts, getCategories, getPriceRange } = useProductSearch();
  
  const [filters, setFilters] = useState<ProductFilter>({
    searchQuery: q as string,
    sortBy: 'newest',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const loadInitialData = useCallback(async () => {
    try {
      const [categoriesData, priceRangeData] = await Promise.all([
        getCategories(),
        getPriceRange(),
      ]);
      setCategories(categoriesData);
      setPriceRange(priceRangeData);
      await searchProducts({ ...filters, searchQuery: q as string });
    } catch (error) {
      console.error('Error loading search data:', error);
    }
  }, [q, filters]);

  useEffect(() => {
    loadInitialData();
  }, [q]);

  const handleFilter = async (newFilters: Partial<ProductFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await searchProducts(updatedFilters);
  };

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <Pressable
      style={[styles.productCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.productImage}
        defaultSource={require('@/assets/images/partial-react-logo.png')}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.02)']}
        style={styles.productContent}
      >
        <ThemedText style={styles.productName} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.productPrice, { color: colors.priceRed }]}>
          ${item.price.toFixed(2)}
        </ThemedText>
        
        <View style={styles.shopInfo}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color={colors.ratingStars} />
            <ThemedText style={styles.rating}>
              {item.shop.rating.toFixed(1)}
            </ThemedText>
          </View>
          <ThemedText style={[styles.shopName, { color: colors.textSecondary }]}>
            {item.shop.name}
          </ThemedText>
        </View>
      </LinearGradient>
    </Pressable>
  ), [colors]);

  const renderFilters = () => (
    <ThemedView style={[styles.filtersContainer, { borderColor: colors.border }]}>
      {/* Sort Section */}
      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Sort By</ThemedText>
        <View style={styles.filterOptions}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.sortBy === option.id ? colors.primary : colors.lightGray,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleFilter({ sortBy: option.id as ProductFilter['sortBy'] })}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  { color: filters.sortBy === option.id ? '#FFFFFF' : colors.text },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Categories Section */}
      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Categories</ThemedText>
        <View style={styles.filterOptions}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filters.category === category ? colors.primary : colors.lightGray,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleFilter({
                category: filters.category === category ? undefined : category,
              })}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  { color: filters.category === category ? '#FFFFFF' : colors.text },
                ]}
              >
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>

      {/* Additional Filters */}
      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Additional Filters</ThemedText>
        <View style={styles.filterOptions}>
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: filters.inStock ? colors.primary : colors.lightGray,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleFilter({ inStock: !filters.inStock })}
          >
            <IconSymbol 
              name="checkmark.circle.fill" 
              size={16} 
              color={filters.inStock ? '#FFFFFF' : colors.icon} 
            />
            <ThemedText
              style={[
                styles.filterChipText,
                { color: filters.inStock ? '#FFFFFF' : colors.text },
              ]}
            >
              In Stock Only
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ThemedView>
  );

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <View style={styles.headerContent}>
        <ThemedText style={styles.searchQuery}>"{q}"</ThemedText>
        <ThemedText style={[styles.resultCount, { color: colors.textSecondary }]}>
          {totalCount} results
        </ThemedText>
      </View>
      <Pressable 
        style={[styles.filterButton, { backgroundColor: colors.lightGray }]}
        onPress={() => setShowFilters(!showFilters)}
      >
        <IconSymbol name="line.3.horizontal.decrease" size={20} color={colors.text} />
        <ThemedText style={styles.filterButtonText}>Filters</ThemedText>
        <IconSymbol
          name={showFilters ? 'chevron.up' : 'chevron.down'}
          size={16}
          color={colors.text}
        />
      </Pressable>
    </ThemedView>
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol 
        name="magnifyingglass" 
        size={48} 
        color={colors.textSecondary} 
      />
      <ThemedText style={styles.emptyTitle}>No Results Found</ThemedText>
      <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
        We couldn't find any products matching your search. Try adjusting your filters or search terms.
      </ThemedText>
      <Pressable
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/explore')}
      >
        <ThemedText style={styles.browseButtonText}>Browse All Products</ThemedText>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {renderHeader()}
      {showFilters && renderFilters()}

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </ThemedView>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
          ListEmptyComponent={renderEmpty()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  searchQuery: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultCount: {
    fontSize: 14,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productGrid: {
    padding: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});