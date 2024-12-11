import React from 'react';
import { StyleSheet, ScrollView, View, Image, ActivityIndicator, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useCartContext } from '@/providers/CartProvider';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, loading, updateQuantity, removeItem, getSubtotal } = useCartContext();
  const { session } = useAuth();

  const handleCheckout = () => {
    if (!session?.user) {
      router.push('/(auth)/login');
      return;
    }
    router.push('/checkout');
  };

  if (loading) {
    return (
      <ThemedView style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!items?.length) {
    return (
      <ThemedView style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>Your Cart is Empty</ThemedText>
        <Button
          title="Start Shopping"
          onPress={() => router.push('/explore')}
          variant="primary"
          size="large"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <ThemedText style={[styles.itemName, { color: colors.text }]}>{item.name}</ThemedText>
              <ThemedText style={[styles.price, { color: colors.text }]}>${item.price}</ThemedText>
              <View style={styles.quantityContainer}>
                <Pressable onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                  <ThemedText style={styles.quantityButton}>-</ThemedText>
                </Pressable>
                <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                <Pressable onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                  <ThemedText style={styles.quantityButton}>+</ThemedText>
                </Pressable>
                <Pressable onPress={() => removeItem(item.id)}>
                  <ThemedText style={[styles.removeText, { color: colors.link }]}>Remove</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.subtotalContainer}>
          <ThemedText style={[styles.subtotalLabel, { color: colors.text }]}>Subtotal</ThemedText>
          <ThemedText style={[styles.subtotalAmount, { color: colors.text }]}>${getSubtotal().toFixed(2)}</ThemedText>
        </View>
        <Button
          title={session?.user ? "Proceed to Checkout" : "Sign in to Checkout"}
          onPress={handleCheckout}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  removeText: {
    fontSize: 14,
    marginLeft: 'auto',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
});