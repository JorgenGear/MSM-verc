import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function ChangePhoneScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
    }
    return cleaned;
  };

  const handlePhoneChange = (text: string, setter: (value: string) => void) => {
    const formattedNumber = formatPhoneNumber(text);
    setter(formattedNumber);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSendVerification = async () => {
    if (!currentPhone || !newPhone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validatePhone(newPhone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // First verify the password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email as string,
        password: password,
      });

      if (signInError) throw signInError;

      // In a real app, send verification code to the new phone number
      // For demo, we'll simulate this
      setShowVerification(true);
      Alert.alert('Verification Code Sent', 'Please check your new phone number for the verification code.');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndUpdate = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      // In a real app, verify the code and update phone number
      // For demo purposes, we'll simulate this with Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ phone: newPhone })
        .eq('id', user?.id);

      if (error) throw error;

      Alert.alert(
        'Success',
        'Your phone number has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Change Phone Number</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Instructions */}
        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            To change your phone number, please verify your current phone number and password.
            A verification code will be sent to your new phone number.
          </ThemedText>
        </ThemedView>

        {!showVerification ? (
          /* Initial Form */
          <ThemedView style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Current Phone Number</ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={currentPhone}
                onChangeText={(text) => handlePhoneChange(text, setCurrentPhone)}
                placeholder="(435) XXX-XXXX"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>New Phone Number</ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={newPhone}
                onChangeText={(text) => handlePhoneChange(text, setNewPhone)}
                placeholder="(435) XXX-XXXX"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Password</ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
              />
            </View>

            <Pressable
              style={[
                styles.updateButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled
              ]}
              onPress={handleSendVerification}
              disabled={loading}
            >
              <ThemedText style={styles.updateButtonText}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          /* Verification Form */
          <ThemedView style={styles.formSection}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Enter Verification Code</ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text
                }]}
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter 6-digit code"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            <Pressable
              style={[
                styles.updateButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled
              ]}
              onPress={handleVerifyAndUpdate}
              disabled={loading}
            >
              <ThemedText style={styles.updateButtonText}>
                {loading ? 'Verifying...' : 'Verify and Update'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Security Note */}
        <ThemedView style={styles.securityNote}>
          <IconSymbol name="lock.fill" size={16} color={colors.textSecondary} />
          <ThemedText style={[styles.securityText, { color: colors.textSecondary }]}>
            Changing your phone number requires verification for your security.
          </ThemedText>
        </ThemedView>
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
  infoSection: {
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
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
  },
  updateButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  securityText: {
    fontSize: 12,
    flex: 1,
  },
});