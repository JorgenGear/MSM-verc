import { StyleSheet, TextInput, Pressable } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function SearchHeader() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.primary }]}>
      <Pressable style={[styles.searchBar, { backgroundColor: colors.searchBar }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          placeholder="Search MainStreet Markets"
          placeholderTextColor={colors.icon}
          style={styles.searchInput}
        />
        <IconSymbol name="camera.fill" size={20} color={colors.icon} />
        <IconSymbol name="mic.fill" size={20} color={colors.icon} />
      </Pressable>
      <Pressable style={styles.locationButton}>
        <IconSymbol name="location.fill" size={16} color="#ffffff" />
        <ThemedText style={styles.locationText}>Deliver to Your Location</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 12,
  },
}); 