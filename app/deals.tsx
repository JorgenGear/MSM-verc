import React, { useState } from 'react';
import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useProducts } from '@/hooks/useProducts';
import { SearchHeader } from '@/components/SearchHeader';

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
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All Deals');

  // Filter products with discounts and sort by discount percentage
  const dealsProducts = products
    ?.filter(product => product.discount > 0)
    .sort((a, b) => b.discount - a.discount) || [];

  const renderDealItem = ({ item }: any) => (
    <Pressable
      style={[styles.dealCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/product/${item.id}`)}>
      <ThemedView style={[styles.dealBadge, { backgroundColor: colors.saveBadge }]}>
        <ThemedText style={styles.dealBadgeText}>
          Save {item.discount}%
        </ThemedText>
      </ThemedView>
      <Image
        source={
          item.image_url
            ? { uri: item.image_url }
            : require('@/assets/images/partial-react-logo.png')
        }
        style={styles.dealImage}
      />
      <ThemedView style={styles.dealInfo}>
        <ThemedText style={styles.dealTitle} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedView style={styles.priceContainer}>
          <ThemedText style={[styles.dealPrice, { color: colors.priceRed }]}>
            ${(item.price * (1 - item.discount / 100)).toFixed(2)}
          </ThemedText>
          <ThemedText style={styles.originalPrice}>
            List: ${item.price}
          </ThemedText>
        </ThemedView>
        <ThemedText style={[styles.shopName, { color: colors.link }]}>
          {item.shop.name}
        </ThemedText>
      </ThemedView>
    </Pressable>
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
            onPress={() => setSelectedCategory(item)}>
            <ThemedText
              style={[
                styles.categoryText,
                {
                  color: selectedCategory === item ? '#ffffff' : colors.mediumGray,
                },
              ]}>
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
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="tag" size={64} color={colors.icon} />
            <ThemedText style={styles.emptyTitle}>No deals available</ThemedText>
            <ThemedText style={styles.emptyText}>
              Check back soon for new deals from local shops
            </ThemedText>
          </ThemedView>
        }
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
    borderRadius: 8,
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
  },
  priceContainer: {
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  shopName: {
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
    opacity: 0.7,
  },
}); 