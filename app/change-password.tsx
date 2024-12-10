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

export default function ChangePasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      requirements: [
        { met: hasMinLength, text: 'At least 8 characters' },
        { met: hasUpperCase, text: 'One uppercase letter' },
        { met: hasLowerCase, text: 'One lowercase letter' },
        { met: hasNumber, text: 'One number' },
        { met: hasSpecialChar, text: 'One special character' }
      ]
    };
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      Alert.alert('Error', 'New password does not meet requirements');
      return;
    }

    setLoading(true);

    try {
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email as string,
        password: currentPassword,
      });

      if (signInError) throw signInError;

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      Alert.alert(
        'Success',
        'Your password has been updated successfully. Please sign in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Change Password</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Instructions */}
        <ThemedView style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            Please enter your current password and choose a new strong password.
          </ThemedText>
        </ThemedView>

        {/* Form */}
        <ThemedView style={styles.formSection}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Current Password</ThemedText>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                  color: colors.text,
                  flex: 1
                }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!passwordVisible}
              />
              <Pressable
                style={styles.visibilityButton}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <IconSymbol
                  name={passwordVisible ? "eye.fill" : "eye.slash.fill"}
                  size={20}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>New Password</ThemedText>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!passwordVisible}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Confirm New Password</ThemedText>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text
              }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!passwordVisible}
            />
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <ThemedText style={styles.requirementsTitle}>Password Requirements:</ThemedText>
            {passwordValidation.requirements.map((req, index) => (
              <View key={index} style={styles.requirementRow}>
                <IconSymbol
                  name={req.met ? "checkmark.circle.fill" : "circle"}
                  size={16}
                  color={req.met ? colors.success : colors.textSecondary}
                />
                <ThemedText style={[
                  styles.requirementText,
                  { color: req.met ? colors.success : colors.textSecondary }
                ]}>
                  {req.text}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        {/* Update Button */}
        <Pressable
          style={[
            styles.updateButton,
            { backgroundColor: colors.primary },
            loading && styles.buttonDisabled
          ]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          <ThemedText style={styles.updateButtonText}>
            {loading ? 'Updating...' : 'Update Password'}
          </ThemedText>
        </Pressable>

        {/* Security Note */}
        <ThemedView style={styles.securityNote}>
          <IconSymbol name="lock.fill" size={16} color={colors.textSecondary} />
          <ThemedText style={[styles.securityText, { color: colors.textSecondary }]}>
            For your security, please choose a strong password that you haven't used before.
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  visibilityButton: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  requirementsContainer: {
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
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