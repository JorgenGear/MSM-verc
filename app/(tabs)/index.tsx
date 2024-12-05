import { StyleSheet, ScrollView, TextInput, Pressable, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderDealCard = (discount: string, price: string, title: string) => (
    <Pressable style={[styles.dealCard, { backgroundColor: colors.background }]}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.dealImage}
      />
      <ThemedView style={styles.dealBadge}>
        <ThemedText style={styles.dealBadgeText}>Up to {discount} off</ThemedText>
      </ThemedView>
      <ThemedText style={styles.dealPrice}>${price}</ThemedText>
      <ThemedText style={styles.dealTitle} numberOfLines={2}>{title}</ThemedText>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <SearchHeader />

      {/* Main Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}>
        {[1, 2, 3].map((item) => (
          <Image
            key={item}
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>

      {/* Quick Links */}
      <ThemedView style={styles.quickLinks}>
        <Pressable style={styles.quickLink}>
          <IconSymbol name="tag.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.quickLinkText}>Today's Deals</ThemedText>
        </Pressable>
        <Pressable style={styles.quickLink}>
          <IconSymbol name="cart.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.quickLinkText}>Buy Again</ThemedText>
        </Pressable>
        <Pressable style={styles.quickLink}>
          <IconSymbol name="gift.fill" size={24} color={colors.primary} />
          <ThemedText style={styles.quickLinkText}>Gift Cards</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Deal of the Day */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Deal of the Day</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>See all deals</ThemedText>
          </Pressable>
        </ThemedView>
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.dealOfDayImage}
        />
        <ThemedText style={styles.dealOfDayTitle}>Special Deal from Local Artisan</ThemedText>
        <ThemedText style={styles.dealTimer}>Ends in 12:34:56</ThemedText>
      </ThemedView>

      {/* Popular Deals */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Popular Deals Near You</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dealsScroll}>
          {renderDealCard('50%', '29.99', 'Local Handmade Craft Special')}
          {renderDealCard('30%', '19.99', 'Fresh Local Produce Bundle')}
          {renderDealCard('25%', '39.99', 'Artisanal Food Package')}
        </ScrollView>
      </ThemedView>

      {/* Recently Viewed */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recently Viewed</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
          {[1, 2, 3, 4].map((item) => (
            <Pressable key={item} style={styles.recentItem}>
              <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.recentImage}
              />
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Featured Categories */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Featured Categories</ThemedText>
        <ThemedView style={styles.categoryGrid}>
          {['Groceries', 'Restaurants', 'Crafts', 'Services'].map((category, index) => (
            <Pressable key={index} style={[styles.categoryCard, { backgroundColor: colors.accent }]}>
              <ThemedText style={styles.categoryText}>{category}</ThemedText>
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
    opacity: 0.8,
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
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
