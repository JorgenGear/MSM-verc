import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCartContext } from '@/providers/CartProvider';
import { router } from 'expo-router';
import { AnimatedTransition } from '@/components/AnimatedTransition';
import { Button } from '@/components/ui/Button';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, updateQuantity, removeItem, getSubtotal } = useCartContext();

  if (!items.length) {
    return (
      <ThemedView style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <AnimatedTransition type="fadeInSlide" delay={300}>
          <IconSymbol name="cart" size={64} color={colors.mediumGray} />
          <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>Your Cart is Empty</ThemedText>
          <ThemedText style={[styles.emptyText, { color: colors.text }]}>
            Browse our local shops and add items to your cart
          </ThemedText>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/explore')}
            variant="primary"
            size="large"
          />
        </AnimatedTransition>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <AnimatedTransition key={item.id} type="fadeIn" delay={200}>
            <ThemedView style={[styles.cartItem, { backgroundColor: colors.productCardBackground }]}>
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <ThemedView style={[styles.itemDetails, { backgroundColor: colors.productCardBackground }]}>
                <ThemedText style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </ThemedText>
                <ThemedText style={[styles.shopName, { color: colors.text }]}>
                  {item.shop_name}
                </ThemedText>
                <ThemedText style={[styles.price, { color: colors.text }]}>
                  ${item.price}
                </ThemedText>
                <ThemedView style={styles.quantityContainer}>
                  <Pressable
                    style={[styles.quantityButton, { backgroundColor: colors.categoryButtonBackground }]}
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      } else {
                        removeItem(item.id);
                      }
                    }}>
                    <IconSymbol name="minus" size={16} color={colors.text} />
                  </Pressable>
                  <ThemedText style={[styles.quantity, { color: colors.text }]}>
                    {item.quantity}
                  </ThemedText>
                  <Pressable
                    style={[styles.quantityButton, { backgroundColor: colors.categoryButtonBackground }]}
                    onPress={() => {
                      const newQuantity = item.quantity + 1;
                      if (newQuantity <= 99) {
                        updateQuantity(item.id, newQuantity);
                      }
                    }}>
                    <IconSymbol name="plus" size={16} color={colors.text} />
                  </Pressable>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id)}>
                    <ThemedText style={[styles.removeText, { color: colors.link }]}>
                      Remove
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </AnimatedTransition>
        ))}
      </ScrollView>

      <ThemedView style={[styles.footer, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.subtotalContainer}>
          <ThemedText style={[styles.subtotalLabel, { color: colors.text }]}>
            Subtotal
          </ThemedText>
          <ThemedText style={[styles.subtotalAmount, { color: colors.text }]}>
            ${getSubtotal().toFixed(2)}
          </ThemedText>
        </ThemedView>
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout')}
          variant="primary"
          size="large"
          fullWidth
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  subtotalAmount: {
    fontSize: 24,
    fontWeight: '600',
  },
}); 