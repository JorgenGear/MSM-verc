import { StyleSheet, ScrollView, View, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Mock data for payment methods
const MOCK_PAYMENT_METHODS = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2024,
    isDefault: true
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expMonth: 3,
    expYear: 2025,
    isDefault: false
  }
];

export default function PaymentMethodsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);

  const handleBack = () => {
    router.back();
  };

  const handleAddCard = () => {
    // In a real app, this would navigate to a card input form
    router.push('/add-payment-method');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleRemoveCard = (id: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods =>
              methods.filter(method => method.id !== id)
            );
          }
        }
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return 'creditcard.fill';
      case 'mastercard':
        return 'creditcard.fill';
      default:
        return 'creditcard.fill';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Payment Methods</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Add New Card Button */}
        <Pressable
          style={[styles.addCardButton, { borderColor: colors.primary }]}
          onPress={handleAddCard}
        >
          <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
          <ThemedText style={[styles.addCardText, { color: colors.primary }]}>
            Add New Card
          </ThemedText>
        </Pressable>

        {/* Saved Cards */}
        <View style={styles.savedCardsSection}>
          <ThemedText style={styles.sectionTitle}>Saved Cards</ThemedText>
          
          {paymentMethods.map((method) => (
            <View 
              key={method.id}
              style={[styles.cardItem, { backgroundColor: colors.productCardBackground }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <IconSymbol 
                    name={getCardIcon(method.type)} 
                    size={24} 
                    color={colors.text} 
                  />
                  <ThemedText style={styles.cardNumber}>
                    •••• {method.last4}
                  </ThemedText>
                  <ThemedText style={styles.cardExpiry}>
                    {method.expMonth}/{method.expYear}
                  </ThemedText>
                </View>
                {method.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.accent }]}>
                    <ThemedText style={styles.defaultText}>Default</ThemedText>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <ThemedText style={[styles.actionText, { color: colors.primary }]}>
                      Set as Default
                    </ThemedText>
                  </Pressable>
                )}
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleRemoveCard(method.id)}
                >
                  <ThemedText style={[styles.actionText, { color: colors.error }]}>
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <IconSymbol name="lock.fill" size={16} color={colors.textSecondary} />
          <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
            Your payment information is encrypted and stored securely. 
            We do not store complete card numbers.
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
    marginBottom: 24,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  savedCardsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardExpiry: {
    fontSize: 14,
    opacity: 0.7,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});