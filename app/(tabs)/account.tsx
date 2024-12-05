import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderMenuItem = (title: string, icon: string) => (
    <Pressable>
      <ThemedView style={[styles.menuItem, { borderColor: colors.border }]}>
        <IconSymbol name={icon} size={24} color={colors.icon} />
        <ThemedText style={styles.menuItemText}>{title}</ThemedText>
        <IconSymbol name="chevron.right" size={20} color={colors.icon} />
      </ThemedView>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerText}>Hello, Sign in</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Your Account</ThemedText>
        {renderMenuItem('Your Orders', 'box.fill')}
        {renderMenuItem('Your Addresses', 'location.fill')}
        {renderMenuItem('Your Payments', 'creditcard.fill')}
        {renderMenuItem('Your Local Shops', 'shop.fill')}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
        {renderMenuItem('Country & Language', 'globe')}
        {renderMenuItem('Notifications', 'bell.fill')}
        {renderMenuItem('Help & Support', 'questionmark.circle.fill')}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 20,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
}); 