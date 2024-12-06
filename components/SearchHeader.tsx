import { StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useProductSearch } from '@/hooks/useProductSearch';

export function SearchHeader() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { searchProducts } = useProductSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      await searchProducts({ searchQuery: query });
      router.push({
        pathname: '/search',
        params: { q: query },
      });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPress = () => {
    // TODO: Implement location selection
    alert('Location selection coming soon!');
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.headerBackground }]}>
      <Pressable 
        style={[styles.searchBar, { backgroundColor: colors.surfaceBackground }]}
        onPress={() => router.push('/search')}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.mediumGray} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="Search MainStreet Markets"
          placeholderTextColor={colors.mediumGray}
          returnKeyType="search"
        />
        {loading ? (
          <ActivityIndicator size="small" color={colors.mediumGray} />
        ) : (
          <>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.push('/camera')}>
              <IconSymbol name="camera.fill" size={20} color={colors.mediumGray} />
            </Pressable>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.push('/voice-search')}>
              <IconSymbol name="mic.fill" size={20} color={colors.mediumGray} />
            </Pressable>
          </>
        )}
      </Pressable>
      <Pressable style={styles.locationButton} onPress={handleLocationPress}>
        <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
        <ThemedText style={styles.locationText}>Deliver to Your Location</ThemedText>
        <IconSymbol name="chevron.down" size={12} color="#FFFFFF" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D5D9D9',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#FFFFFF',
    marginLeft: 4,
    marginRight: 4,
    fontSize: 12,
    fontWeight: '500',
  },
}); 