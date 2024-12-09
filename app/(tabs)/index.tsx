import { StyleSheet, ScrollView, Pressable, Image, Dimensions, View } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';

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
      description: 'Discover amazing local deals',
      link: '/deals',
    },
    {
      id: 2,
      image: require('@/assets/images/partial-react-logo.png'),
      title: 'Local Favorites',
      description: 'Support your local community',
      link: '/explore',
    },
    {
      id: 3,
      image: require('@/assets/images/partial-react-logo.png'),
      title: 'New Arrivals',
      description: 'Fresh finds from local sellers',
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

  const renderCarouselIndicators = () => (
    <View style={styles.indicatorContainer}>
      {carouselItems.map((_, index) => (
        <Pressable
          key={index}
          onPress={() => setCarouselIndex(index)}
          style={[
            styles.indicator,
            { backgroundColor: index === carouselIndex ? colors.primary : 'rgba(255,255,255,0.5)' }
          ]}
        />
      ))}
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <SearchHeader />

      {/* Enhanced Carousel */}
      <View style={styles.carouselContainer}>
        {carouselItems.map((item, index) => (
          <Pressable
            key={item.id}
            style={[
              styles.carouselSlide,
              { opacity: index === carouselIndex ? 1 : 0 }
            ]}
            onPress={() => router.push(item.link)}
          >
            <Image source={item.image} style={styles.carouselImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            >
              <ThemedText style={styles.carouselTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.carouselDescription}>
                {item.description}
              </ThemedText>
            </LinearGradient>
          </Pressable>
        ))}
        {renderCarouselIndicators()}
      </View>

      {/* Quick Links */}

      <View style={styles.quickLinks}>
        <Pressable 
          style={[styles.quickLinkItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/deals')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.lightGray }]}>
            <IconSymbol name="tag.fill" size={24} color={colors.primary} />
          </View>
          <ThemedText style={styles.quickLinkText}>Today's Deals</ThemedText>
        </Pressable>

        <Pressable 
          style={[styles.quickLinkItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/buy-again')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.lightGray }]}>
            <IconSymbol name="cart.fill" size={24} color={colors.primary} />
          </View>
          <ThemedText style={styles.quickLinkText}>Buy Again</ThemedText>
        </Pressable>

        <Pressable 
          style={[styles.quickLinkItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/gift-cards')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.lightGray }]}>
            <IconSymbol name="gift.fill" size={24} color={colors.primary} />
          </View>
          <ThemedText style={styles.quickLinkText}>Gift Cards</ThemedText>
        </Pressable>
      </View>

      {/* Deal of the Day Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Deal of the Day</ThemedText>
          <Pressable onPress={() => router.push('/deals')}>
            <ThemedText style={[styles.seeAll, { color: colors.link }]}>See all deals</ThemedText>
          </Pressable>
        </ThemedView>
        
        {products && products.length > 0 && (
          <Pressable 
            onPress={() => router.push(`/product/${products[0].id}`)}
            style={styles.dealOfDay}
          >
            <Image
              source={products[0]?.image_url 
                ? { uri: products[0].image_url }
                : require('@/assets/images/partial-react-logo.png')}
              style={styles.dealOfDayImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.dealGradient}
            >
              <ThemedText style={styles.dealOfDayTitle}>
                {products[0]?.name || 'Special Deal from Local Artisan'}
              </ThemedText>
              <ThemedText style={styles.dealTimer}>Limited Time Offer</ThemedText>
            </LinearGradient>
          </Pressable>
        )}
      </ThemedView>

      {/* Popular Deals */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Popular Deals Near You</ThemedText>
          <Pressable onPress={() => router.push('/deals')}>
            <ThemedText style={[styles.seeAll, { color: colors.link }]}>View all</ThemedText>
          </Pressable>
        </ThemedView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
          {products?.slice(0, 5).map(product => (
            <Pressable 
              key={product.id}
              style={[styles.dealCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Image
                source={{ uri: product.image_url || require('@/assets/images/partial-react-logo.png') }}
                style={styles.dealImage}
              />
              <View style={[styles.dealBadge, { backgroundColor: colors.saveBadge }]}>
                <ThemedText style={styles.dealBadgeText}>
                  Up to {product.discount || '20%'} off
                </ThemedText>
              </View>
              <View style={styles.dealContent}>
                <ThemedText style={styles.dealPrice}>${product.price}</ThemedText>
                <ThemedText style={styles.dealTitle} numberOfLines={2}>
                  {product.name}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Recently Viewed */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recently Viewed</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
            {recentlyViewed.map((product) => (
              <Pressable 
                key={product.id}
                style={styles.recentItem}
                onPress={() => router.push(`/product/${product.id}`)}
              >
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
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Featured Categories</ThemedText>
        <View style={styles.categoryGrid}>
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
              onPress={() => router.push({ 
                pathname: '/explore', 
                params: { category: category.toLowerCase() } 
              })}
            >
              <ThemedText style={[styles.categoryText, { color: colors.text }]}>
                {category}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 240,
    position: 'relative',
  },
  carouselSlide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    padding: 16,
    justifyContent: 'flex-end',
  },
  carouselTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  carouselDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  quickLinkItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  dealOfDay: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dealOfDayImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  dealGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  dealOfDayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dealTimer: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
  },
  dealsScroll: {
    marginTop: 8,
  },
  dealCard: {
    width: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dealImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  dealContent: {
    padding: 12,
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  recentScroll: {
    marginTop: 8,
  },
  recentItem: {
    marginRight: 12,
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
    marginTop: 8,
  },
  categoryCard: {
    width: '48%',
    height: 100,
    marginBottom: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
});