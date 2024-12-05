import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProductSearch, ProductFilter } from '@/hooks/useProductSearch';

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading, totalCount, searchProducts, getCategories, getPriceRange } =
    useProductSearch();
  const [filters, setFilters] = useState<ProductFilter>({
    searchQuery: q as string,
    sortBy: 'newest',
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [q]);

  const loadInitialData = async () => {
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
  };

  const handleFilter = async (newFilters: Partial<ProductFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    await searchProducts(updatedFilters);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <Pressable
      style={[styles.productCard, { backgroundColor: colors.background }]}
      onPress={() => router.push(`/product/${item.id}`)}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
      )}
      <ThemedView style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
        <ThemedView style={styles.shopInfo}>
          <ThemedText style={styles.shopName}>{item.shop.name}</ThemedText>
          <ThemedView style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={12} color={colors.secondary} />
            <ThemedText style={styles.rating}>{item.shop.rating.toFixed(1)}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );

  const renderFilters = () => (
    <ThemedView style={styles.filtersContainer}>
      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Sort By</ThemedText>
        <ThemedView style={styles.filterOptions}>
          {['newest', 'price_asc', 'price_desc', 'rating'].map((option) => (
            <Pressable
              key={option}
              style={[
                styles.filterOption,
                {
                  backgroundColor:
                    filters.sortBy === option ? colors.primary : colors.background,
                },
              ]}
              onPress={() => handleFilter({ sortBy: option as ProductFilter['sortBy'] })}>
              <ThemedText
                style={[
                  styles.filterOptionText,
                  { color: filters.sortBy === option ? '#ffffff' : colors.text },
                ]}>
                {option.replace('_', ' ').toUpperCase()}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Categories</ThemedText>
        <ThemedView style={styles.filterOptions}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.filterOption,
                {
                  backgroundColor:
                    filters.category === category ? colors.primary : colors.background,
                },
              ]}
              onPress={() =>
                handleFilter({
                  category: filters.category === category ? undefined : category,
                })
              }>
              <ThemedText
                style={[
                  styles.filterOptionText,
                  { color: filters.category === category ? '#ffffff' : colors.text },
                ]}>
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.filterSection}>
        <ThemedText style={styles.filterTitle}>Other Filters</ThemedText>
        <ThemedView style={styles.filterOptions}>
          <Pressable
            style={[
              styles.filterOption,
              {
                backgroundColor: filters.inStock ? colors.primary : colors.background,
              },
            ]}
            onPress={() => handleFilter({ inStock: !filters.inStock })}>
            <ThemedText
              style={[
                styles.filterOptionText,
                { color: filters.inStock ? '#ffffff' : colors.text },
              ]}>
              IN STOCK
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>
          {totalCount} results for "{q}"
        </ThemedText>
        <Pressable onPress={() => setShowFilters(!showFilters)}>
          <IconSymbol
            name={showFilters ? 'chevron.up' : 'chevron.down'}
            size={24}
            color={colors.icon}
          />
        </Pressable>
      </ThemedView>

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
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <IconSymbol name="exclamationmark.triangle" size={48} color={colors.icon} />
              <ThemedText style={styles.emptyText}>No products found</ThemedText>
            </ThemedView>
          }
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
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: {
    fontSize: 14,
    opacity: 0.7,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  filtersContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 