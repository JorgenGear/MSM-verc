import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, ActivityIndicator, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCartContext } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutScreen() {
  const { type, amount, design } = useLocalSearchParams(); // For gift cards
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCartContext();
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handlePayment = async () => {
    try {
      setLoading(true);
      // Stripe integration will go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated payment
      
      // Clear cart and navigate to success
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderSummary = () => (
    <ThemedView style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
      <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
      
      {items.map(item => (
        <ThemedView key={item.id} style={styles.summaryItem}>
          <ThemedView style={styles.summaryItemInfo}>
            <ThemedText numberOfLines={1} style={styles.summaryItemName}>
              {item.name}
            </ThemedText>
            <ThemedText style={[styles.summaryItemQty, { color: colors.textSecondary }]}>
              Qty: {item.quantity}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.summaryItemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </ThemedText>
        </ThemedView>
      ))}

      <View style={styles.divider} />

      <ThemedView style={styles.summaryRow}>
        <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Subtotal
        </ThemedText>
        <ThemedText style={styles.summaryValue}>${getSubtotal().toFixed(2)}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryRow}>
        <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Tax
        </ThemedText>
        <ThemedText style={styles.summaryValue}>${getTax().toFixed(2)}</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.summaryRow, styles.totalRow]}>
        <ThemedText style={styles.totalLabel}>Total</ThemedText>
        <ThemedText style={[styles.totalValue, { color: colors.primary }]}>
          ${getTotal().toFixed(2)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );

  const renderShippingStep = () => (
    <ThemedView style={styles.formContainer}>
      <ThemedText style={styles.sectionTitle}>Shipping Address</ThemedText>
      {/* We'll add the form later */}
      <ThemedText style={[styles.placeholder, { color: colors.textSecondary }]}>
        Shipping form coming soon
      </ThemedText>
    </ThemedView>
  );
  
  const renderPaymentStep = () => (
    <ThemedView style={styles.formContainer}>
      <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>
      {/* We'll add Stripe Elements later */}
      <ThemedText style={[styles.placeholder, { color: colors.textSecondary }]}>
        Payment form coming soon
      </ThemedText>
    </ThemedView>
  );
  
  const renderReviewStep = () => (
    <ThemedView style={styles.formContainer}>
      <ThemedText style={styles.sectionTitle}>Review Order</ThemedText>
      {/* We'll add order review later */}
      <ThemedText style={[styles.placeholder, { color: colors.textSecondary }]}>
        Order review coming soon
      </ThemedText>
    </ThemedView>
  );
  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <ThemedView style={styles.progressContainer}>
          {['shipping', 'payment', 'review'].map((step, index) => (
            <React.Fragment key={step}>
              <ThemedView 
                style={[
                  styles.progressStep,
                  { 
                    backgroundColor: 
                      currentStep === step ? colors.primary : 
                      index < ['shipping', 'payment', 'review'].indexOf(currentStep) 
                        ? colors.success 
                        : colors.lightGray 
                  }
                ]}
              >
                <ThemedText style={[styles.stepNumber, { color: '#FFFFFF' }]}>
                  {index + 1}
                </ThemedText>
              </ThemedView>
              {index < 2 && (
                <View 
                  style={[
                    styles.progressLine,
                    { 
                      backgroundColor: 
                        index < ['shipping', 'payment', 'review'].indexOf(currentStep) 
                          ? colors.success 
                          : colors.lightGray 
                    }
                  ]} 
                />
              )}
            </React.Fragment>
          ))}
        </ThemedView>

        {/* Current Step Content */}
        {currentStep === 'shipping' && renderShippingStep()}
        {currentStep === 'payment' && renderPaymentStep()}
        {currentStep === 'review' && renderReviewStep()}

        {/* Order Summary */}
        {renderOrderSummary()}
      </ScrollView>

      {/* Bottom Action Button */}
      <ThemedView style={styles.bottomBar}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={currentStep === 'review' ? handlePayment : () => {
            const steps: CheckoutStep[] = ['shipping', 'payment', 'review'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex < steps.length - 1) {
              setCurrentStep(steps[currentIndex + 1]);
            }
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.actionButtonText}>
              {currentStep === 'review' ? 'Place Order' : 'Continue'}
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  summaryItemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryItemQty: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 14,
    textAlign: 'center',
    padding: 32,
  },
});