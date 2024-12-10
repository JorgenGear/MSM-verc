import { router, Link } from 'expo-router';
import { StyleSheet, ScrollView, Pressable, Image, Dimensions, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';

const { width } = Dimensions.get('window');

type CarouselItem = {
  id: number;
  image: any;
  title: string;
  description: string;
  link: string;
  gradient: [string, string];
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { products, loading } = useProducts();
  const { recentlyViewed } = useCart();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      image: require('@/assets/images/carousel/shopping-people.jpg'),
      title: 'Local Deals',
      description: 'Save up to 50% on local favorites',
      link: '/deals',
      gradient: ['transparent', 'rgba(0,0,0,0.7)']
    },
    {
      id: 2,
      image: require('@/assets/images/carousel/artisan-workshop.jpg'),
      title: 'Meet Local Artisans',
      description: 'Discover unique handcrafted items',
      link: '/explore',
      gradient: ['transparent', 'rgba(0,0,0,0.7)']
    },
    {
      id: 3,
      image: require('@/assets/images/carousel/seasonal-products.jpg'),
      title: 'Seasonal Specials',
      description: 'Fresh picks for every season',
      link: '/new-arrivals',
      gradient: ['transparent', 'rgba(0,0,0,0.7)']
    }
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
          <Link
            key={item.id}
            href={item.link as any}
            style={[
              styles.carouselSlide,
              { opacity: index === carouselIndex ? 1 : 0 }
            ]}
            asChild
          >
            <Pressable>
              <Image source={item.image} style={styles.carouselImage} />
              <LinearGradient
                colors={item.gradient}
                style={styles.gradient}
              >
                <ThemedText style={styles.carouselTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.carouselDescription}>
                  {item.description}
                </ThemedText>
              </LinearGradient>
            </Pressable>
          </Link>
        ))}
        {renderCarouselIndicators()}
      </View>

      {/* Quick Links */}

      <View style={styles.quickLinks}>
        <Pressable 
          style={[styles.quickLinkItem]}
          onPress={() => router.push('/deals')}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol name="tag.fill" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.quickLinkLabel}>Daily</ThemedText>
                <ThemedText style={styles.quickLinkText}>Deals</ThemedText>
              </View>
            </View>
            <View style={[styles.decorativeCircle, styles.decorativeCircleLarge]} />
            <View style={[styles.decorativeCircle, styles.decorativeCircleSmall]} />
            <View style={styles.shine} />
          </LinearGradient>
        </Pressable>

        <Pressable 
          style={[styles.quickLinkItem]}
          onPress={() => router.push('/buy-again')}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol name="arrow.clockwise.circle.fill" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.quickLinkLabel}>Quick</ThemedText>
                <ThemedText style={styles.quickLinkText}>Reorder</ThemedText>
              </View>
            </View>
            <View style={[styles.decorativeCircle, styles.decorativeCircleLarge]} />
            <View style={[styles.decorativeCircle, styles.decorativeCircleSmall]} />
            <View style={styles.shine} />
          </LinearGradient>
        </Pressable>

        <Pressable 
          style={[styles.quickLinkItem]}
          onPress={() => router.push('/gift-cards')}
        >
          <LinearGradient
            colors={['#4FACFE', '#00F2FE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <View style={styles.contentContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol name="gift.fill" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.quickLinkLabel}>Send</ThemedText>
                <ThemedText style={styles.quickLinkText}>Gifts</ThemedText>
              </View>
            </View>
            <View style={[styles.decorativeCircle, styles.decorativeCircleLarge]} />
            <View style={[styles.decorativeCircle, styles.decorativeCircleSmall]} />
            <View style={styles.shine} />
          </LinearGradient>
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

      {/* Flash Sales */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.sectionTitle}>Flash Sales</ThemedText>
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <ThemedText style={styles.badgeText}>24h Only</ThemedText>
            </View>
          </View>
          <Pressable onPress={() => router.push('/deals')}>
            <ThemedText style={[styles.seeAll, { color: colors.link }]}>View all</ThemedText>
          </Pressable>
        </ThemedView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.flashSalesScroll}
        >
          {products?.slice(0, 5).map(product => (
            <Pressable 
              key={product.id}
              style={[styles.flashSaleCard, { backgroundColor: colors.cardBackground }]}
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <Image
                source={{ uri: product.image_url }}
                style={styles.flashSaleImage}
                defaultSource={require('@/assets/images/partial-react-logo.png')}
              />
              <View style={styles.flashSaleContent}>
                <View style={[styles.timerBadge, { backgroundColor: colors.error }]}>
                  <IconSymbol name="clock.fill" size={12} color="#FFFFFF" />
                  <ThemedText style={styles.timerText}>5h 23m left</ThemedText>
                </View>
                <ThemedText style={styles.flashSaleTitle} numberOfLines={2}>
                  {product.name}
                </ThemedText>
                <View style={styles.priceRow}>
                  <ThemedText style={[styles.flashSalePrice, { color: colors.priceRed }]}>
                    ${product.price}
                  </ThemedText>
                  <View style={styles.savingBadge}>
                    <ThemedText style={styles.savingText}>Save 30%</ThemedText>
                  </View>
                </View>
                {product.shop && (
                  <ThemedText style={[styles.shopName, { color: colors.textSecondary }]} numberOfLines={1}>
                    {product.shop.name}
                  </ThemedText>
                )}
              </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  quickLinkItem: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientBackground: {
    flex: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    gap: 2,
  },
  quickLinkLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quickLinkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 0,
  },
  decorativeCircleLarge: {
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  decorativeCircleSmall: {
    right: 40,
    top: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%)',
    transform: [{ skewY: '-20deg' }],
    zIndex: 0,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  flashSalesScroll: {
    marginTop: 16,
  },
  flashSaleCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  flashSaleImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  flashSaleContent: {
    padding: 12,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  flashSaleTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    height: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flashSalePrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  savingBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingText: {
    color: '#FF4B4B',
    fontSize: 12,
    fontWeight: '600',
  },
  shopName: {
    fontSize: 12,
  },
});