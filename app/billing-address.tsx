import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Initial mock data for addresses
const MOCK_ADDRESSES = [
  {
    id: '1',
    name: 'John Doe',
    street: '123 Main Street',
    apt: 'Apt 4B',
    city: 'Logan',
    state: 'UT',
    zipCode: '84321',
    phone: '(435) 123-4567',
    isDefault: true
  }
];

export default function BillingAddressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    apt: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      apt: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    });
    setIsAddingAddress(false);
    setEditingAddress(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.street || !formData.city || 
        !formData.state || !formData.zipCode || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;

    if (editingAddress) {
      // Edit existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress ? { ...addr, ...formData } : addr
      ));
    } else {
      // Add new address
      const newAddress = {
        id: String(Date.now()),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, newAddress]);
    }
    resetForm();
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleEditAddress = (address: typeof MOCK_ADDRESSES[0]) => {
    setFormData({
      name: address.name,
      street: address.street,
      apt: address.apt || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone
    });
    setEditingAddress(address.id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Billing Address</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {!isAddingAddress ? (
          <>
            {/* Add New Address Button */}
            <Pressable
              style={[styles.addButton, { borderColor: colors.primary }]}
              onPress={() => setIsAddingAddress(true)}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
              <ThemedText style={[styles.addButtonText, { color: colors.primary }]}>
                Add New Address
              </ThemedText>
            </Pressable>

            {/* Address List */}
            {addresses.map((address) => (
              <ThemedView
                key={address.id}
                style={[styles.addressCard, { backgroundColor: colors.productCardBackground }]}
              >
                {address.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.accent }]}>
                    <ThemedText style={styles.defaultText}>Default</ThemedText>
                  </View>
                )}

                <View style={styles.addressInfo}>
                  <ThemedText style={styles.addressName}>{address.name}</ThemedText>
                  <ThemedText style={styles.addressText}>{address.street}</ThemedText>
                  {address.apt && <ThemedText style={styles.addressText}>{address.apt}</ThemedText>}
                  <ThemedText style={styles.addressText}>
                    {address.city}, {address.state} {address.zipCode}
                  </ThemedText>
                  <ThemedText style={styles.addressText}>{address.phone}</ThemedText>
                </View>

                <View style={styles.addressActions}>
                  {!address.isDefault && (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(address.id)}
                    >
                      <ThemedText style={[styles.actionText, { color: colors.primary }]}>
                        Set as Default
                      </ThemedText>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <ThemedText style={[styles.actionText, { color: colors.primary }]}>
                      Edit
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <ThemedText style={[styles.actionText, { color: colors.error }]}>
                      Delete
                    </ThemedText>
                  </Pressable>
                </View>
              </ThemedView>
            ))}
          </>
        ) : (
          <View style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </ThemedText>

            <View style={styles.formFields}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter full name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Street Address</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  value={formData.street}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, street: text }))}
                  placeholder="Enter street address"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Apt, Suite, etc. (optional)</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  value={formData.apt}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, apt: text }))}
                  placeholder="Enter apartment or suite number"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 2 }]}>
                  <ThemedText style={styles.inputLabel}>City</ThemedText>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground }]}
                    value={formData.city}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                    placeholder="Enter city"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <ThemedText style={styles.inputLabel}>State</ThemedText>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground }]}
                    value={formData.state}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                    placeholder="UT"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={2}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <ThemedText style={styles.inputLabel}>ZIP</ThemedText>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground }]}
                    value={formData.zipCode}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, zipCode: text }))}
                    placeholder="84321"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Phone</ThemedText>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="(435) 123-4567"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.formButtons}>
              <Pressable
                style={[styles.button, styles.secondaryButton, { borderColor: colors.primary }]}
                onPress={resetForm}
              >
                <ThemedText style={[styles.buttonText, { color: colors.primary }]}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveAddress}
              >
                <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
                  Save Address
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}
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
    addButton: {
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
    addButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    addressCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    defaultBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 8,
    },
    defaultText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#fff',
    },
    addressInfo: {
      marginBottom: 16,
    },
    addressName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    addressText: {
      fontSize: 14,
      lineHeight: 20,
      opacity: 0.7,
    },
    addressActions: {
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
    formContainer: {
      gap: 24,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
    },
    formFields: {
      gap: 16,
    },
    inputGroup: {
      gap: 8,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      borderColor: 'rgba(0,0,0,0.1)',
    },
    rowInputs: {
      flexDirection: 'row',
      gap: 12,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    button: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryButton: {
      borderWidth: 0,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });