// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuItem = ({ icon, title, subtitle, onPress, showBadge, badgeCount }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>
      <Ionicons name={icon} size={24} color="#007AFF" />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {showBadge && badgeCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount}</Text>
      </View>
    )}
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock user data
  const user = {
    name: 'Rifat Ibn Alam',
    email: 'rifat.alam@usu.edu',
    phone: '+1 000 000 0000',
    orders: 12,
    wishlist: 5,
  };

  // Change your handleLogout function to this:
  const handleLogout = () => {
    // Clear user data or call logout context function
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImage}>
            <Ionicons name="person-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>


          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.statNumber}>{user.orders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Text style={styles.statNumber}>{user.wishlist}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* Orders & Shopping */}
        <SectionHeader title="Orders & Shopping" />
        <MenuItem 
          icon="receipt-outline"
          title="Order History"
          subtitle="View past orders"
          onPress={() => navigation.navigate('OrderHistory')}
        />
        <MenuItem 
          icon="location-outline"
          title="Shipping Addresses"
          subtitle="View Shipping Addresses"
          onPress={() => navigation.navigate('Addresses')}
        />
        <MenuItem 
          icon="card-outline"
          title="Payment Methods"
          subtitle="View Payment Methods"
          onPress={() => navigation.navigate('PaymentMethods')}
        />

        {/* Account Settings */}
        <SectionHeader title="Account Settings" />
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
            <Text style={styles.settingTitle}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Ionicons name="location-outline" size={24} color="#007AFF" />
            <Text style={styles.settingTitle}>Location Services</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#ddd', true: '#007AFF' }}
            thumbColor="#fff"
          />
        </View>

        {/* Support & About */}
        <SectionHeader title="Support & About" />
        <MenuItem 
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get assistance and support"
          onPress={() => navigation.navigate('Support')}
        />
        <MenuItem 
          icon="document-text-outline"
          title="Terms & Conditions"
          subtitle="View our terms of service"
          onPress={() => navigation.navigate('Terms')}
        />
        <MenuItem 
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          subtitle="Learn how we protect your data"
          onPress={() => navigation.navigate('Privacy')}
        />
        <MenuItem 
          icon="information-circle-outline"
          title="About Us"
          subtitle="Learn more about Main Street Markets"
          onPress={() => navigation.navigate('About')}
        />

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF4B4B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Added padding for tab bar
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
  },
  sectionHeader: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FFF3F3',
  },
  logoutText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginVertical: 20,
  },
});

export default ProfileScreen;