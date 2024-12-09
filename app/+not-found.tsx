import { Link, Stack } from 'expo-router';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Page Not Found',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTitleStyle: {
            color: '#FFFFFF',
          },
          headerTintColor: '#FFFFFF',
        }} 
      />

      <IconSymbol 
        name="exclamationmark.triangle" 
        size={64} 
        color={colors.textSecondary} 
      />

      <ThemedText style={styles.title}>
        Page Not Found
      </ThemedText>

      <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
        The page you're looking for doesn't exist or has been moved.
      </ThemedText>

      <Link href="/" asChild>
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
          <IconSymbol name="house" size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>
            Return to Home
          </ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});