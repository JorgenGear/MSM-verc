import React from 'react';
import { Modal, StyleSheet, View, Pressable, Animated } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

type AddToCartModalProps = {
  visible: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
};

export function AddToCartModal({ visible, onClose, productName, productImage }: AddToCartModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.overlay} 
        onPress={onClose}
      >
        <Pressable 
          style={[styles.modalContent, { backgroundColor: colors.background }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.successIcon}>
            <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
          </View>

          <ThemedText style={styles.title}>Added to Cart!</ThemedText>
          <ThemedText style={[styles.productName, { color: colors.textSecondary }]} numberOfLines={2}>
            {productName}
          </ThemedText>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.continueButton, { backgroundColor: colors.secondary }]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>Continue Shopping</ThemedText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.viewCartButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                onClose();
                router.push('/cart');
              }}
            >
              <IconSymbol name="cart.fill" size={20} color="#FFFFFF" />
              <ThemedText style={styles.buttonText}>View Cart</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButton: {
    opacity: 0.9,
  },
  viewCartButton: {
    opacity: 0.95,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 