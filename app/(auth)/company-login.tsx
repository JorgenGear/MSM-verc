import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CompanyLoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is a company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_company')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile?.is_company) {
        throw new Error('This account is not registered as a company');
      }

      router.replace('/(seller)/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconSymbol name="building.2.fill" size={48} color={colors.primary} />
        <ThemedText style={styles.title}>MainStreet Markets</ThemedText>
        <ThemedText style={styles.subtitle}>Company Sign In</ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        {error && (
          <ThemedView style={[styles.errorContainer, { backgroundColor: colors.error }]}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Company Email</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your company email"
            placeholderTextColor={colors.icon}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Password</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.icon}
            secureTextEntry
          />
        </ThemedView>

        <Link href="/forgot-password" style={styles.forgotPassword}>
          <ThemedText style={{ color: colors.primary }}>Forgot password?</ThemedText>
        </Link>

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
          )}
        </Pressable>

        <ThemedView style={styles.footer}>
          <ThemedText>Don't have a company account? </ThemedText>
          <Link href="/company-register" style={{ color: colors.primary }}>
            Register here
          </Link>
        </ThemedView>

        <ThemedView style={styles.regularLoginContainer}>
          <Link href="/login" style={{ color: colors.primary }}>
            <ThemedText style={styles.regularLoginText}>Back to regular sign in</ThemedText>
          </Link>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  form: {
    flex: 1,
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
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  regularLoginContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  regularLoginText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 