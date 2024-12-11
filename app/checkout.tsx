import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCartContext } from '@/providers/CartProvider';
import { supabase } from '@/lib/supabase';

export default function CheckoutScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const { items, getSubtotal, clearCart } = useCartContext();
  const [loading, setLoading] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  // Calculate total with Utah tax rate
  const subtotal = getSubtotal();
  const tax = subtotal * 0.0895; // 8.95% tax rate
  const total = subtotal + tax;

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setCardDetails(prev => ({ ...prev, expiry: formatted }));
  };

  const handleSubmitOrder = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating order with data:', {
        user_id: user?.id,
        total: total,
        items: items
      });

      const orderData = {
        user_id: user?.id,
        total: Number(total.toFixed(2))  // Changed from total_amount to total to match DB column
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Order created successfully:', data);

      // Clear cart
      await clearCart();

      // Navigate to success
      router.replace('/checkout/success');
      
    } catch (error: any) {
      console.error('Order creation error:', error);
      Alert.alert(
        'Error',
        'Failed to process order. Please try again. ' + 
        (error.message || '')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <ThemedText style={styles.headerTitle}>Checkout</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Order Summary */}
        <ThemedView style={[styles.section, { backgroundColor: colors.productCardBackground }]}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText>Subtotal:</ThemedText>
            <ThemedText>${subtotal.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText>Tax (8.95%):</ThemedText>
            <ThemedText>${tax.toFixed(2)}</ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalText}>Total Amount:</ThemedText>
            <ThemedText style={styles.totalAmount}>${total.toFixed(2)}</ThemedText>
          </View>
        </ThemedView>

        {/* Payment Details */}
        <ThemedView style={[styles.section, { backgroundColor: colors.productCardBackground }]}>
          <ThemedText style={styles.sectionTitle}>Payment Details</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Card Number</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              value={cardDetails.number}
              onChangeText={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <ThemedText style={styles.inputLabel}>Expiry</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                value={cardDetails.expiry}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <ThemedText style={styles.inputLabel}>CVC</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                value={cardDetails.cvc}
                onChangeText={text => setCardDetails(prev => ({ ...prev, cvc: text.replace(/\D/g, '') }))}
                placeholder="123"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Cardholder Name</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              value={cardDetails.name}
              onChangeText={text => setCardDetails(prev => ({ ...prev, name: text }))}
              placeholder="Name on card"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>
        </ThemedView>

        {/* Place Order Button */}
        <Pressable
          style={[
            styles.orderButton,
            { backgroundColor: colors.primary },
            loading && styles.buttonDisabled
          ]}
          onPress={handleSubmitOrder}
          disabled={loading}
        >
          <ThemedText style={styles.orderButtonText}>
            {loading ? 'Processing...' : 'Place Order'}
          </ThemedText>
        </Pressable>

        
      </ThemedView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
    paddingTop: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  orderButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    flex: 1,
  },
});