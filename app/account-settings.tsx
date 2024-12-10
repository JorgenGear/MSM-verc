import { StyleSheet, ScrollView, View, Pressable, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AccountSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  const [isEditingName, setIsEditingName] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const settingsGroups = [
    {
      title: "Profile Settings",
      items: [
        {
          icon: "person.fill",
          label: "Name",
          value: user?.email?.split('@')[0] || 'User',
          action: () => setIsEditingName(true)
        },
        {
          icon: "envelope.fill",
          label: "Email",
          value: user?.email,
          action: () => router.push('/change-email')
        },
        {
          icon: "phone.fill",
          label: "Phone",
          value: "+1 (435) XXX-XXXX",
          action: () => router.push('/change-phone')
        }
      ]
    },
    {
      title: "Security",
      items: [
        {
          icon: "lock.fill",
          label: "Change Password",
          action: () => router.push('/change-password')
        },
        {
          icon: "shield.fill",
          label: "Two-Factor Authentication",
          value: "Enabled",
          action: () => router.push('/two-factor')
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "bell.fill",
          label: "Notifications",
          isToggle: true,
          value: notifications,
          onToggle: setNotifications
        },
        {
          icon: "mail.fill",
          label: "Marketing Emails",
          isToggle: true,
          value: marketingEmails,
          onToggle: setMarketingEmails
        },
        {
          icon: "box.fill",
          label: "Order Updates",
          isToggle: true,
          value: orderUpdates,
          onToggle: setOrderUpdates
        }
      ]
    },
    {
      title: "Payment",
      items: [
        {
          icon: "creditcard.fill",
          label: "Payment Methods",
          action: () => router.push('/payment-methods')
        },
        {
          icon: "building.2.fill",
          label: "Billing Address",
          action: () => router.push('/billing-address')
        }
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Back Button */}
      <ThemedView style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#fff" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Account Settings</ThemedText>
        <View style={styles.headerRight} />
      </ThemedView>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <ThemedView key={groupIndex} style={styles.settingsGroup}>
          <ThemedText style={styles.groupTitle}>{group.title}</ThemedText>
          
          {group.items.map((item, itemIndex) => (
            <Pressable
              key={itemIndex}
              style={[
                styles.settingItem,
                { backgroundColor: colors.productCardBackground }
              ]}
              onPress={item.action}
              disabled={item.isToggle}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
                  <IconSymbol name={item.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
                  {item.value && !item.isToggle && (
                    <ThemedText style={styles.settingValue}>{item.value}</ThemedText>
                  )}
                </View>
              </View>
              
              {item.isToggle ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#767577', true: colors.primary }}
                  thumbColor="#fff"
                />
              ) : (
                <IconSymbol name="chevron.right" size={20} color={colors.text} />
              )}
            </Pressable>
          ))}
        </ThemedView>
      ))}

      {/* Sign Out Button */}
      <ThemedView style={styles.signOutSection}>
        <Pressable
          style={[styles.signOutButton, { borderColor: colors.error }]}
          onPress={signOut}
        >
          <ThemedText style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* App Version */}
      <ThemedView style={styles.versionSection}>
        <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
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
    width: 40, // For layout balance
  },
  settingsGroup: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  signOutSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  signOutButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionSection: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    opacity: 0.5,
  },
});