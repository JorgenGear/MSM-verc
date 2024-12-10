import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { AccountScreen } from '@/components/AccountScreen';

export default function Account() {
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user) {
      router.replace('/(auth)/login');
    }
  }, [session?.user]);

  if (!session?.user) {
    return <ThemedView style={styles.container} />;
  }

  return <AccountScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});