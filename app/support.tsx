import { StyleSheet, ScrollView, View, Pressable, Linking } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';

const CONTACT_OPTIONS = [
  {
    title: "Call Us",
    description: "Speak with our support team",
    icon: "phone.fill",
    action: "tel:+14351234567",
    details: "(435) 123-4567",
    available: "Mon-Fri, 9AM-6PM MT"
  },
  {
    title: "Email Support",
    description: "Get help via email",
    icon: "envelope.fill",
    action: "mailto:support@mainstreetmarkets.com",
    details: "support@mainstreetmarkets.com",
    available: "Response within 24 hours"
  },
  {
    title: "Visit Us",
    description: "Come to our main office",
    icon: "location.fill",
    details: "123 Main Street, Logan, UT 84321",
    available: "Mon-Fri, 10AM-5PM MT"
  }
];

export default function CustomerServiceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleContactPress = (action?: string) => {
    if (action) {
      Linking.openURL(action);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <ThemedView style={[styles.headerSection, { backgroundColor: colors.headerBackground }]}>
        <ThemedText style={styles.headerTitle}>How can we help you?</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          We're here to help with any questions about your local shopping experience
        </ThemedText>
      </ThemedView>

      {/* Quick Links */}
      
      <ThemedView style={styles.quickLinksSection}>

      </ThemedView>

      {/* Contact Options */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>
        {CONTACT_OPTIONS.map((option, index) => (
          <Pressable
            key={index}
            style={[styles.contactCard, { backgroundColor: colors.productCardBackground }]}
            onPress={() => handleContactPress(option.action)}
          >
            <View style={styles.contactHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
                <IconSymbol name={option.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactTitle}>{option.title}</ThemedText>
                <ThemedText style={styles.contactDescription}>{option.description}</ThemedText>
              </View>
            </View>
            <View style={styles.contactDetails}>
              <ThemedText style={styles.contactDetailText}>{option.details}</ThemedText>
              <ThemedText style={styles.contactAvailability}>{option.available}</ThemedText>
            </View>
          </Pressable>
        ))}
      </ThemedView>

      {/* Additional Support */}
      <ThemedView style={[styles.section, styles.lastSection]}>
        <ThemedText style={styles.sectionTitle}>Additional Support</ThemedText>
        <Pressable
          style={[styles.supportButton, { backgroundColor: colors.primary }]}
          onPress={() => Linking.openURL('https://mainstreetmarkets.com/help')}
        >
          <ThemedText style={styles.supportButtonText}>Visit Help Center</ThemedText>
        </Pressable>
        <ThemedText style={styles.supportText}>
          For detailed guides, policies, and more resources, visit our full help center.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  quickLinksSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  quickLink: {
    alignItems: 'center',
    gap: 8,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  contactDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  contactDetailText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactAvailability: {
    fontSize: 14,
    opacity: 0.7,
  },
  supportButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  supportText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});