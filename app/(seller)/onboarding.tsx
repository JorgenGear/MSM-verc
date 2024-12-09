import { StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function SellerOnboarding() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    contactEmail: '',
    contactPhone: '',
    businessAddress: '',
    businessHours: '',
  });

  const handleSubmit = async () => {
    if (!session?.user) {
      router.replace('/(auth)/login');
      return;
    }

    try {
      setLoading(true);

      // Check if seller profile exists and update or create accordingly
      const { data: existingProfile, error: fetchError } = await supabase
        .from('seller_profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw fetchError;
      }

      // Update or insert seller profile
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .upsert({
          id: session.user.id,
          business_name: formData.businessName,
          business_description: formData.businessDescription,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          business_address: formData.businessAddress,
          business_hours: formData.businessHours,
          created_at: existingProfile?.created_at || new Date().toISOString(),
        });

      if (sellerError) throw sellerError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_seller: true })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // Check if shop exists
      const { data: existingShop, error: shopFetchError } = await supabase
        .from('shops')
        .select()
        .eq('owner_id', session.user.id)
        .single();

      if (shopFetchError && shopFetchError.code !== 'PGRST116') {
        throw shopFetchError;
      }

      // Update or create shop
      const { error: shopError } = await supabase
        .from('shops')
        .upsert({
          id: existingShop?.id, // Keep existing ID if it exists
          name: formData.businessName,
          description: formData.businessDescription,
          owner_id: session.user.id,
          location: formData.businessAddress,
          category: existingShop?.category || 'General',
          rating: existingShop?.rating || 0,
          created_at: existingShop?.created_at || new Date().toISOString(),
        });

      if (shopError) throw shopError;

      router.replace('/(seller)/dashboard');
    } catch (error) {
      console.error('Error updating seller profile:', error);
      alert('Error updating seller profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>Become a Seller</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Set up your business profile to start selling on MainStreet Markets
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Business Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.businessName}
            onChangeText={(text) => setFormData({ ...formData, businessName: text })}
            placeholder="Your business name"
            placeholderTextColor={colors.icon}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Business Description</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.background }]}
            value={formData.businessDescription}
            onChangeText={(text) => setFormData({ ...formData, businessDescription: text })}
            placeholder="Tell customers about your business"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Contact Email</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.contactEmail}
            onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
            placeholder="Business contact email"
            placeholderTextColor={colors.icon}
            keyboardType="email-address"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Contact Phone</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.contactPhone}
            onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
            placeholder="Business phone number"
            placeholderTextColor={colors.icon}
            keyboardType="phone-pad"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Business Address</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.background }]}
            value={formData.businessAddress}
            onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
            placeholder="Full business address"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={3}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Business Hours</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.background }]}
            value={formData.businessHours}
            onChangeText={(text) => setFormData({ ...formData, businessHours: text })}
            placeholder="e.g., Mon-Fri: 9AM-5PM"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={2}
          />
        </ThemedView>

        <Pressable
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.submitButtonText}>Create Seller Account</ThemedText>
          )}
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
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 