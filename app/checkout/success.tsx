import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

export default function PaymentSuccessScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleGoHome = () => {
    router.push('/(tabs)');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
          <IconSymbol 
            name="checkmark.circle.fill" 
            size={64} 
            color={colors.primary} 
          />
        </View>

        {/* Success Message */}
        <ThemedText style={styles.title}>Payment Successful!</ThemedText>
        <ThemedText style={styles.message}>
          Thank you for your order. Your payment has been processed successfully.
        </ThemedText>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={handleGoHome}
          >
            <ThemedText style={styles.primaryButtonText}>Continue Shopping</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={handleViewOrders}
          >
            <ThemedText style={[styles.secondaryButtonText, { color: colors.primary }]}>
              View Orders
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});