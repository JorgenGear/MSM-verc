import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';

export default function PaymentMethodsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Payment Methods
        </ThemedText>
        <Button
          title="Add New Payment Method"
          onPress={() => {}}
          variant="primary"
          size="large"
          fullWidth
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
}); 