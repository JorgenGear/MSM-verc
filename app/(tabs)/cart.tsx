import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderCartItem = () => (
    <ThemedView style={[styles.cartItem, { borderColor: colors.border }]}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.itemImage}
      />
      <ThemedView style={styles.itemDetails}>
        <ThemedText style={styles.itemTitle}>Local Artisan Handmade Item</ThemedText>
        <ThemedText style={styles.itemPrice}>$29.99</ThemedText>
        <ThemedText style={styles.inStock}>In Stock</ThemedText>
        <ThemedText style={styles.shipping}>Eligible for Local Pickup</ThemedText>
        
        <ThemedView style={styles.itemActions}>
          <Pressable style={styles.quantitySelector}>
            <ThemedText>Qty: 1</ThemedText>
            <IconSymbol name="chevron.down" size={16} color={colors.icon} />
          </Pressable>
          <Pressable>
            <ThemedText style={styles.actionText}>Delete</ThemedText>
          </Pressable>
          <Pressable>
            <ThemedText style={styles.actionText}>Save for later</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );

  const renderSimilarItem = () => (
    <Pressable style={[styles.similarItem, { backgroundColor: colors.background }]}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.similarImage}
      />
      <ThemedText style={styles.similarTitle} numberOfLines={2}>Similar Local Product</ThemedText>
      <ThemedText style={styles.similarPrice}>$24.99</ThemedText>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Subtotal Section */}
      <ThemedView style={[styles.subtotalContainer, { borderColor: colors.border }]}>
        <ThemedText style={styles.subtotalText}>Subtotal (1 item): $29.99</ThemedText>
        <Pressable style={[styles.checkoutButton, { backgroundColor: colors.secondary }]}>
          <ThemedText style={styles.checkoutButtonText}>
            Proceed to Checkout
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Cart Items */}
      <ThemedView style={styles.cartItemsContainer}>
        <ThemedText style={styles.sectionTitle}>Shopping Cart</ThemedText>
        {renderCartItem()}
        {renderCartItem()}
      </ThemedView>

      {/* Saved for Later */}
      <ThemedView style={[styles.section, { borderColor: colors.border }]}>
        <ThemedText style={styles.sectionTitle}>Saved for Later (2 items)</ThemedText>
        {renderCartItem()}
      </ThemedView>

      {/* Similar Items */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Similar items from local shops</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
          {[1, 2, 3, 4].map((item) => (
            <ThemedView key={item}>
              {renderSimilarItem()}
            </ThemedView>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Buy Again */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Buy Again</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
          {[1, 2, 3].map((item) => (
            <ThemedView key={item}>
              {renderSimilarItem()}
            </ThemedView>
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
  subtotalContainer: {
    padding: 15,
    borderBottomWidth: 1,
    backgroundColor: '#f7f7f7',
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  checkoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  cartItemsContainer: {
    padding: 15,
  },
  section: {
    padding: 15,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  inStock: {
    color: '#007600',
    fontSize: 14,
    marginBottom: 2,
  },
  shipping: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 4,
    gap: 4,
  },
  actionText: {
    color: '#0066c0',
    fontSize: 14,
  },
  similarScroll: {
    marginTop: 10,
  },
  similarItem: {
    width: 150,
    marginRight: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  similarImage: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  similarPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 