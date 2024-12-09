import React, { useState, useCallback } from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProducts } from '@/hooks/useProducts';
import { SearchHeader } from '@/components/SearchHeader';
import { LinearGradient } from 'expo-linear-gradient';

const DEAL_CATEGORIES = [
  'All Deals',
  'Local Favorites',
  'Lightning Deals',
  'Best Sellers',
  'Ending Soon',
];

export default function DealsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading, refreshProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [refreshing, setRefreshing] = useState(false);

  // Filter products with discounts and sort by discount percentage
  const dealsProducts = products
    ?.filter(product => product.discount > 0)
    .sort((a, b) => b.discount - a.discount) || [];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  }, [refreshProducts]);

  const renderDealItem = ({ item }: any) => (
    <Pressable
      style={[styles.dealCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      {/* Discount Badge */}
      <ThemedView style={[styles.dealBadge, { backgroundColor: colors.saveBadge }]}>
        <ThemedText style={styles.dealBadgeText}>
          Save {item.discount}%
        </ThemedText>
      </ThemedView>

      {/* Product Image */}
      <Image
        source={
          item.image_url
            ? { uri: item.image_url }
            : require('@/assets/images/partial-react-logo.png')
        }
        style={styles.dealImage}
        defaultSource={require('@/assets/images/partial-react-logo.png')}
      />

      {/* Deal Info */}
      <ThemedView style={styles.dealInfo}>
        <ThemedText style={styles.dealTitle} numberOfLines={2}>
          {item.name}
        </ThemedText>

        {/* Price Section */}
        <ThemedView style={styles.priceContainer}>
          <ThemedText style={[styles.dealPrice, { color: colors.priceRed }]}>
            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
          </ThemedText>
          <ThemedText style={[styles.originalPrice, { color: colors.textSecondary }]}>
            List: ${item.price}
          </ThemedText>
        </ThemedView>

        {/* Shop Info */}
        {item.shop && (
          <ThemedView style={styles.shopInfo}>
            <ThemedText style={[styles.shopName, { color: colors.link }]}>
              {item.shop.name}
            </ThemedText>
            <ThemedView style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={14} color={colors.ratingStars} />
              <ThemedText style={styles.rating}>
                {item.shop.rating.toFixed(1)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        )}

        {/* Time Remaining */}
        {item.endsAt && (
          <ThemedView style={styles.timeContainer}>
            <IconSymbol name="clock" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.timeText, { color: colors.textSecondary }]}>
              Ends in {item.endsAt}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </Pressable>
  );

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol name="tag" size={64} color={colors.icon} />
      <ThemedText style={styles.emptyTitle}>No deals available</ThemedText>
      <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
        Check back soon for new deals from local shops
      </ThemedText>
    </ThemedView>
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
      <Stack.Screen options={{ title: "Today's Deals" }} />
      <SearchHeader />

      {/* Categories */}
      <FlatList
        horizontal
        data={DEAL_CATEGORIES}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === item ? colors.primary : colors.lightGray,
              },
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <ThemedText
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === item ? '#ffffff' : colors.mediumGray,
                },
              ]}
            >
              {item}
            </ThemedText>
          </Pressable>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      />

      {/* Deals Grid */}
      <FlatList
        data={dealsProducts}
        renderItem={renderDealItem}
        numColumns={2}
        contentContainerStyle={styles.dealsGrid}
        columnWrapperStyle={styles.dealsRow}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
        onRefresh={onRefresh}
        refreshing={refreshing}
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
  },
  categories: {
    padding: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dealsGrid: {
    padding: 8,
  },
  dealsRow: {
    justifyContent: 'space-between',
  },
  dealCard: {
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
  dealImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  dealBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dealInfo: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    height: 40,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 8,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  shopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
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
  },
});