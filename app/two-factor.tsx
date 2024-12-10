import { StyleSheet, ScrollView, View, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export default function TwoFactorScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  // In a real app, fetch the 2FA status from your backend
  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const checkTwoFactorStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setIs2FAEnabled(data?.two_factor_enabled || false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const generateBackupCodes = () => {
    // In a real app, these would be generated securely on the backend
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleEnable2FA = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email as string,
        password: password,
      });

      if (signInError) throw signInError;

      // In a real app, this would generate a QR code and secret
      generateBackupCodes();
      setShowSetup(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      // In a real app, verify the code with your backend
      // For demo, we'll simulate verification
      if (verificationCode.length !== 6) {
        throw new Error('Invalid verification code');
      }

      // Update 2FA status
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', user?.id);

      if (error) throw error;

      setIs2FAEnabled(true);
      setShowSetup(false);
      Alert.alert('Success', 'Two-factor authentication has been enabled');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email as string,
        password: password,
      });

      if (signInError) throw signInError;

      // Update 2FA status
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('id', user?.id);

      if (error) throw error;

      setIs2FAEnabled(false);
      setPassword('');
      Alert.alert('Success', 'Two-factor authentication has been disabled');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to disable 2FA');
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
        <ThemedText style={styles.headerTitle}>Two-Factor Authentication</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      <ThemedView style={styles.content}>
        {/* Status Section */}
        <ThemedView style={[styles.statusSection, { backgroundColor: colors.productCardBackground }]}>
          <View style={styles.statusHeader}>
            <IconSymbol 
              name="shield.fill" 
              size={24} 
              color={is2FAEnabled ? colors.success : colors.textSecondary} 
            />
            <ThemedText style={styles.statusTitle}>
              {is2FAEnabled ? 'Enabled' : 'Not Enabled'}
            </ThemedText>
          </View>
          <ThemedText style={styles.statusDescription}>
            {is2FAEnabled 
              ? 'Your account is protected with two-factor authentication.'
              : 'Add an extra layer of security to your account.'}
          </ThemedText>
        </ThemedView>

        {!showSetup ? (
          <ThemedView style={styles.actionSection}>
            {!is2FAEnabled ? (
              <>
                <ThemedText style={styles.sectionTitle}>Enable Two-Factor Authentication</ThemedText>
                <ThemedText style={styles.description}>
                  Two-factor authentication adds an extra layer of security to your account. 
                  You'll need to enter a code from your authentication app when signing in.
                </ThemedText>
                
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
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
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={handleEnable2FA}
                  disabled={loading}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {loading ? 'Setting up...' : 'Set up two-factor authentication'}
                  </ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                <ThemedText style={styles.sectionTitle}>Disable Two-Factor Authentication</ThemedText>
                <ThemedText style={styles.description}>
                  Warning: Disabling two-factor authentication will make your account less secure.
                </ThemedText>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
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
                  style={[styles.actionButton, { backgroundColor: colors.error }]}
                  onPress={handleDisable2FA}
                  disabled={loading}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {loading ? 'Disabling...' : 'Disable two-factor authentication'}
                  </ThemedText>
                </Pressable>
              </>
            )}
          </ThemedView>
        ) : (
          <ThemedView style={styles.setupSection}>
            <ThemedText style={styles.sectionTitle}>Setup Two-Factor Authentication</ThemedText>
            
            {/* Setup Instructions */}
            <View style={styles.steps}>
              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>1</ThemedText>
                <ThemedText style={styles.stepText}>
                  Download an authenticator app like Google Authenticator or Authy
                </ThemedText>
              </View>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>2</ThemedText>
                <ThemedText style={styles.stepText}>
                  Scan the QR code or enter the setup key manually in your authenticator app
                </ThemedText>
              </View>

              <View style={styles.step}>
                <ThemedText style={styles.stepNumber}>3</ThemedText>
                <ThemedText style={styles.stepText}>
                  Enter the 6-digit verification code from your authenticator app
                </ThemedText>
              </View>
            </View>

            {/* Verification Code Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Verification Code</ThemedText>
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

            {/* Backup Codes */}
            {backupCodes.length > 0 && (
              <View style={styles.backupCodesSection}>
                <ThemedText style={styles.backupCodesTitle}>Backup Codes</ThemedText>
                <ThemedText style={styles.backupCodesDescription}>
                  Save these backup codes in a secure place. You can use these to sign in if you lose access to your authenticator app.
                </ThemedText>
                <View style={styles.backupCodesList}>
                  {backupCodes.map((code, index) => (
                    <ThemedText key={index} style={styles.backupCode}>{code}</ThemedText>
                  ))}
                </View>
              </View>
            )}

            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleVerifyAndEnable}
              disabled={loading}
            >
              <ThemedText style={styles.actionButtonText}>
                {loading ? 'Verifying...' : 'Verify and Enable'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {/* Security Note */}
        <ThemedView style={styles.securityNote}>
          <IconSymbol name="lock.fill" size={16} color={colors.textSecondary} />
          <ThemedText style={[styles.securityText, { color: colors.textSecondary }]}>
            Two-factor authentication significantly improves your account security by requiring a second form of verification.
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
      gap: 24,
    },
    statusSection: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    statusDescription: {
      fontSize: 14,
      opacity: 0.7,
    },
    actionSection: {
      gap: 16,
    },
    setupSection: {
      gap: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      opacity: 0.7,
      marginBottom: 16,
    },
    steps: {
      gap: 16,
      marginBottom: 24,
    },
    step: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    },
    stepNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#f0f0f0',
      textAlign: 'center',
      lineHeight: 24,
      fontSize: 14,
      fontWeight: '600',
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
    inputGroup: {
      gap: 8,
      marginBottom: 24,
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
    actionButton: {
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    backupCodesSection: {
      gap: 12,
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginBottom: 24,
    },
    backupCodesTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    backupCodesDescription: {
      fontSize: 14,
      opacity: 0.7,
      lineHeight: 20,
    },
    backupCodesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    backupCode: {
      fontSize: 14,
      fontFamily: 'monospace',
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 4,
      width: '48%',
      textAlign: 'center',
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginTop: 8,
    },
    securityText: {
      fontSize: 12,
      flex: 1,
      lineHeight: 16,
    },
    qrContainer: {
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginVertical: 16,
    },
    secretKey: {
      fontFamily: 'monospace',
      fontSize: 14,
      backgroundColor: '#f5f5f5',
      padding: 8,
      borderRadius: 4,
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
      marginVertical: 16,
    },
    buttonDisabled: {
      opacity: 0.5,
    }
  });