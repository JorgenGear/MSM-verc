import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Button } from '@/components/ui/Button';

export default function AddressesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Alex Thompson',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      name: 'Alex Thompson',
      street: '456 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      isDefault: false,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemedView style={styles.content}>
        {addresses.map((address) => (
          <ThemedView
            key={address.id}
            style={[styles.addressCard, { backgroundColor: colors.cardBackground }]}
          >
            <ThemedView style={styles.addressHeader}>
              <ThemedView style={styles.addressTypeContainer}>
                <IconSymbol
                  name={address.type.toLowerCase() === 'home' ? 'house' : 'briefcase'}
                  size={20}
                  color={colors.primary}
                />
                <ThemedText style={[styles.addressType, { color: colors.text }]}>
                  {address.type}
                </ThemedText>
              </ThemedView>
              {address.isDefault && (
                <ThemedView style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={styles.defaultText}>Default</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            
            <ThemedText style={[styles.name, { color: colors.text }]}>{address.name}</ThemedText>
            <ThemedText style={[styles.address, { color: colors.mediumGray }]}>
              {address.street}
            </ThemedText>
            <ThemedText style={[styles.address, { color: colors.mediumGray }]}>
              {`${address.city}, ${address.state} ${address.zip}`}
            </ThemedText>
            
            <ThemedView style={styles.actions}>
              <Button
                title="Edit"
                onPress={() => {}}
                variant="secondary"
                size="small"
              />
              {!address.isDefault && (
                <Button
                  title="Set as Default"
                  onPress={() => {}}
                  variant="secondary"
                  size="small"
                  style={{ marginLeft: 8 }}
                />
              )}
            </ThemedView>
          </ThemedView>
        ))}

        <Button
          title="Add New Address"
          onPress={() => {}}
          variant="primary"
          size="large"
          style={styles.addButton}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  addressCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  addButton: {
    marginTop: 8,
  },
}); 