import { StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderProductCard = (title: string, price: string, rating: string, reviews: string) => (
    <Pressable style={[styles.productCard, { backgroundColor: colors.background }]}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.productImage}
      />
      <ThemedView style={styles.productInfo}>
        <ThemedText style={styles.productTitle} numberOfLines={2}>{title}</ThemedText>
        <ThemedView style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={16} color={colors.secondary} />
          <ThemedText style={styles.rating}>{rating}</ThemedText>
          <ThemedText style={styles.reviews}>({reviews})</ThemedText>
        </ThemedView>
        <ThemedText style={styles.primeEligible}>Eligible for Local Pickup</ThemedText>
        <ThemedText style={styles.price}>${price}</ThemedText>
      </ThemedView>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <SearchHeader />

      {/* Filter Bar */}
      <ThemedView style={[styles.filterBar, { borderColor: colors.border }]}>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="line.3.horizontal.decrease" size={20} color={colors.icon} />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="arrow.up.arrow.down" size={20} color={colors.icon} />
          <ThemedText style={styles.filterText}>Sort</ThemedText>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <IconSymbol name="map" size={20} color={colors.icon} />
          <ThemedText style={styles.filterText}>Map View</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Categories Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}>
        {['All', 'Local Shops', 'Handmade', 'Food', 'Services', 'Crafts'].map((category, index) => (
          <Pressable 
            key={index} 
            style={[
              styles.categoryChip,
              { backgroundColor: index === 0 ? colors.primary : colors.background }
            ]}>
            <ThemedText style={[
              styles.categoryChipText,
              { color: index === 0 ? '#ffffff' : colors.text }
            ]}>
              {category}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results Count */}
      <ThemedText style={styles.resultsCount}>285 results in your area</ThemedText>

      {/* Product Grid */}
      <ThemedView style={styles.productGrid}>
        {renderProductCard('Local Artisan Handmade Pottery', '49.99', '4.8', '127')}
        {renderProductCard('Fresh Local Organic Produce Box', '34.99', '4.9', '89')}
        {renderProductCard('Handcrafted Jewelry Set', '79.99', '4.7', '56')}
        {renderProductCard('Local Honey Collection', '24.99', '4.9', '234')}
      </ThemedView>

      {/* Featured Shops */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Featured Local Shops</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Artisan Market', 'Fresh Foods', 'Craft Corner'].map((shop, index) => (
            <Pressable 
              key={index} 
              style={[styles.shopCard, { backgroundColor: colors.background }]}>
              <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.shopImage}
              />
              <ThemedText style={styles.shopName}>{shop}</ThemedText>
              <ThemedView style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={16} color={colors.secondary} />
                <ThemedText style={styles.rating}>4.8</ThemedText>
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
