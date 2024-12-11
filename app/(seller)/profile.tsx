import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function SellerProfile() {
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setFormData({
            businessName: data.business_name || '',
            businessDescription: data.business_description || '',
            contactEmail: data.contact_email || '',
            contactPhone: data.contact_phone || '',
            businessAddress: data.business_address || '',
            businessHours: data.business_hours || '',
          });
        }
      }
    };

    fetchProfile();
  }, [session]);

  const handleSubmit = async () => {
    if (!session?.user) {
      router.replace('/(auth)/login');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('shops')
        .upsert({
          name: formData.businessName,
          description: formData.businessDescription,
        });

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>Seller Profile</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Update your business information
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
            <ThemedText style={styles.submitButtonText}>Update Profile</ThemedText>
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