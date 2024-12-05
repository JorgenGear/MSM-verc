import { StyleSheet, ScrollView, TextInput, Pressable, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';
import { router } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading } = useProducts();
  const { recentlyViewed } = useCart();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    {
      id: 1,
      image: require('@/assets/images/partial-react-logo.png'),
      title: 'Special Deals',
      link: '/deals',
    },
    {
      id: 2,
      image: require('@/assets/images/partial-react-logo.png'),
      title: 'Local Favorites',
      link: '/explore',
    },
    {
      id: 3,
      image: require('@/assets/images/partial-react-logo.png'),
      title: 'New Arrivals',
      link: '/new-arrivals',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((current) => 
        current === carouselItems.length - 1 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderDealCard = (product: any) => (
    <Pressable 
      key={product.id}
      style={[styles.dealCard, { backgroundColor: colors.productCardBackground }]}
      onPress={() => router.push(`/product/${product.id}`)}>
      <Image
        source={{ uri: product.image_url || require('@/assets/images/partial-react-logo.png') }}
        style={styles.dealImage}
      />
      <ThemedView style={[styles.dealBadge, { backgroundColor: colors.primary }]}>
        <ThemedText style={[styles.dealBadgeText, { color: '#FFFFFF' }]}>
          Up to {product.discount || '20%'} off
        </ThemedText>
      </ThemedView>
      <ThemedText style={[styles.dealPrice, { color: colors.text }]}>${product.price}</ThemedText>
      <ThemedText style={[styles.dealTitle, { color: colors.text }]} numberOfLines={2}>
        {product.name}
      </ThemedText>
    </Pressable>
  );

  const navigateToDeals = () => router.push('/deals');
  const navigateToBuyAgain = () => router.push('/buy-again');
  const navigateToGiftCards = () => router.push('/gift-cards');
  const navigateToCategory = (category: string) => 
    router.push({ pathname: '/explore', params: { category: category.toLowerCase() } });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchHeader />

      {/* Main Carousel */}
      <Pressable onPress={() => router.push(carouselItems[carouselIndex].link)}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
          scrollEnabled={false}>
          {carouselItems.map((item, index) => (
            <Image
              key={item.id}
              source={item.image}
              style={[
                styles.carouselImage,
                { opacity: index === carouselIndex ? 1 : 0 }
              ]}
            />
          ))}
        </ScrollView>
      </Pressable>

      {/* Quick Links */}
      <ThemedView style={[styles.quickLinks, { backgroundColor: colors.background }]}>
        <Pressable style={styles.quickLink} onPress={navigateToDeals}>
          <IconSymbol name="tag.fill" size={24} color={colors.primary} />
          <ThemedText style={[styles.quickLinkText, { color: colors.text }]}>Today's Deals</ThemedText>
        </Pressable>
        <Pressable style={styles.quickLink} onPress={navigateToBuyAgain}>
          <IconSymbol name="cart.fill" size={24} color={colors.primary} />
          <ThemedText style={[styles.quickLinkText, { color: colors.text }]}>Buy Again</ThemedText>
        </Pressable>
        <Pressable style={styles.quickLink} onPress={navigateToGiftCards}>
          <IconSymbol name="gift.fill" size={24} color={colors.primary} />
          <ThemedText style={[styles.quickLinkText, { color: colors.text }]}>Gift Cards</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Deal of the Day */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Deal of the Day</ThemedText>
          <Pressable onPress={navigateToDeals}>
            <ThemedText style={[styles.seeAll, { color: colors.link }]}>See all deals</ThemedText>
          </Pressable>
        </ThemedView>
        <Pressable onPress={() => products?.[0]?.id && router.push(`/product/${products[0].id}`)}>
          <Image
            source={products?.[0]?.image_url 
              ? { uri: products[0].image_url }
              : require('@/assets/images/partial-react-logo.png')}
            style={styles.dealOfDayImage}
          />
          <ThemedText style={styles.dealOfDayTitle}>
            {products?.[0]?.name || 'Special Deal from Local Artisan'}
          </ThemedText>
          <ThemedText style={styles.dealTimer}>Limited Time Offer</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Popular Deals */}
      <ThemedView style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
        <ThemedText style={styles.sectionTitle}>Popular Deals Near You</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
          {(products || []).slice(0, 5).map(product => renderDealCard(product))}
        </ScrollView>
      </ThemedView>

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <ThemedView style={[styles.section, { backgroundColor: '#FFFFFF' }]}>
          <ThemedText style={styles.sectionTitle}>Recently Viewed</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
            {recentlyViewed.map((product) => (
              <Pressable 
                key={product.id}
                style={styles.recentItem}
                onPress={() => router.push(`/product/${product.id}`)}>
                <Image
                  source={{ uri: product.image_url || require('@/assets/images/partial-react-logo.png') }}
                  style={styles.recentImage}
                />
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>
      )}

      {/* Featured Categories */}
      <ThemedView style={[styles.section, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Featured Categories</ThemedText>
        <ThemedView style={styles.categoryGrid}>
          {['Groceries', 'Restaurants', 'Crafts', 'Services'].map((category, index) => (
            <Pressable 
              key={index} 
              style={[
                styles.categoryCard, 
                { 
                  backgroundColor: colors.categoryButtonBackground,
                  borderWidth: 1,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => navigateToCategory(category)}>
              <ThemedText style={[styles.categoryText, { color: colors.text }]}>
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carousel: {
    height: 200,
  },
  carouselImage: {
    width,
    height: 200,
    resizeMode: 'cover',
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  quickLink: {
    alignItems: 'center',
  },
  quickLinkText: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    color: '#0066c0',
    fontSize: 14,
  },
  dealOfDayImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  dealOfDayTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  dealTimer: {
    color: '#cc0c39',
    fontSize: 14,
  },
  dealsScroll: {
    marginTop: 10,
  },
  dealCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dealImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  dealBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#cc0c39',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dealBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 14,
  },
  recentScroll: {
    marginTop: 10,
  },
  recentItem: {
    marginRight: 15,
  },
  recentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryCard: {
    width: '48%',
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
