import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '@/lib/supabase';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function CompanyRegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      if (!companyName || !email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Register user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            is_company: true,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Wait for session to be established
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        throw new Error('Failed to create account. Please try signing in.');
      }

      // Create company profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          username: email.split('@')[0],
          full_name: companyName,
          company_name: companyName,
          email: email,
          is_company: true,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Create company storefront
      const { error: storefrontError } = await supabase
        .from('shops')
        .insert({
          name: companyName,
          owner_id: session.user.id,
          description: `Official store of ${companyName}`,
          location: '',
          category: 'General',
          rating: 0,
          created_at: new Date().toISOString(),
        });

      if (storefrontError) throw storefrontError;

      router.replace('/(seller)/dashboard');
    } catch (error) {
      console.error('Error registering:', error);
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
        <ThemedText style={styles.subtitle}>Create Company Account</ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        {error && (
          <ThemedView style={[styles.errorContainer, { backgroundColor: colors.error }]}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Company Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Enter your company name"
            placeholderTextColor={colors.icon}
          />
        </ThemedView>

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
            placeholder="Create a password"
            placeholderTextColor={colors.icon}
            secureTextEntry
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Confirm Password</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            placeholderTextColor={colors.icon}
            secureTextEntry
          />
        </ThemedView>

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.buttonText}>Create Company Account</ThemedText>
          )}
        </Pressable>

        <ThemedView style={styles.footer}>
          <ThemedText>Already have a company account? </ThemedText>
          <Link href="/company-login" style={{ color: colors.primary }}>
            Sign in
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