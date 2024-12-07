// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

// Import all screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import CartScreen from './src/screens/CartScreen';
import ProductScreen from './src/screens/ProductScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AuthPromptScreen from './src/screens/auth/AuthPromptScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import LogoutScreen from './src/screens/auth/LogoutScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import OrderHistoryScreen from './src/screens/profile/OrderHistoryScreen';
import ShippingAddressesScreen from './src/screens/profile/ShippingAddressesScreen';
import PaymentMethodsScreen from './src/screens/profile/PaymentMethodsScreen';
import SupportScreen from './src/screens/profile/SupportScreen';
import TermsScreen from './src/screens/profile/TermsScreen';
import PrivacyScreen from './src/screens/profile/PrivacyScreen';
import AboutScreen from './src/screens/profile/AboutScreen';
import AddPaymentMethodScreen from './src/screens/profile/AddPaymentMethodScreen';
import EditShippingAddressScreen from './src/screens/profile/EditShippingAddressScreen';
import AddShippingAddressScreen from './src/screens/profile/AddShippingAddressScreen';
import OrderDetailsScreen from './src/screens/profile/OrderDetailsScreen';
import LeaveReviewScreen from './src/screens/profile/LeaveReviewScreen';
import TrackOrderScreen from './src/screens/profile/TrackOrderScreen';
import ShopScreen from './src/screens/ShopScreen';


// Import providers
import { WishlistProvider } from './src/context/WishlistContext';
import { CartProvider } from './src/context/CartContext';
import { UserProvider } from './src/context/UserContext';
// import { AuthProvider } from './src/context/AuthContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { useProducts } from './src/context/ProductContext';

import TestConnection from './src/components/common/TestConnection';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Search':
            iconName = focused ? 'search' : 'search-outline';
            break;
          case 'Cart':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'Wishlist':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        title: 'Main Street Markets'
      }}
    />
    <Tab.Screen 
      name="Search" 
      component={SearchScreen}
      options={{
        title: 'Search'
      }}
    />
    <Tab.Screen 
      name="Cart" 
      component={CartScreen}
      options={{
        title: 'Shopping Cart'
      }}
    />
    <Tab.Screen 
      name="Wishlist" 
      component={WishlistScreen}
      options={{
        title: 'Wishlist'
      }}
    />
    
    <Tab.Screen 
      name="Profile" 
      //component={ProfileScreen}
      component={AuthPromptScreen}
      options={{
        title: 'My Profile'
      }}
    />
  </Tab.Navigator>
);

const RootStack = () => {
  const { selectedProduct } = useProducts(); 

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Shop" 
        component={ShopScreen}
        options={({ route }) => ({
          title: route.params?.shop?.name || 'Shop Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        })}
      />
      <Stack.Screen 
        name="Product" 
        component={ProductScreen}
        options={({ route }) => ({
          title: selectedProduct?.name || route.params?.product?.name || 'Product Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
        })}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      {/* Add these auth-related screens */}
        <Stack.Screen 
        name="Profile" 
        component={AuthPromptScreen}
        options={{ 
          headerShown: false 
        }}
        />

        <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{ 
          headerShown: false 
        }}
        />

        <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ 
          headerShown: false 
        }}
        />

        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ 
          headerShown: false 
        }}
        />

    
    
        <Stack.Screen 
          name="MyProfile" 
          component={ProfileScreen}
          options={{ 
          headerShown: false 
        }}
        />

      {/* Add EditProfile Screen */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          title: 'Edit Profile',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
          <Stack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{
          title: 'Order History',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

          <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen}
        options={{
          title: 'Order Details',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
      <Stack.Screen 
        name="LeaveReview" 
        component={LeaveReviewScreen}
        options={{
          title: 'Write a Review',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <Stack.Screen 
        name="TrackOrder" 
        component={TrackOrderScreen}
        options={{
          title: 'Track Order',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

          <Stack.Screen 
        name="Addresses" 
        component={ShippingAddressesScreen}
        options={{
          title: 'Shipping Addresses',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

          <Stack.Screen 
        name="EditAddress" 
        component={EditShippingAddressScreen}
        options={{
          title: 'Edit Shipping Address',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

          <Stack.Screen 
        name="AddAddress" 
        component={AddShippingAddressScreen}
        options={{
          title: 'Add New Address',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{
          title: 'Payment Methods',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
      }}
      />
      <Stack.Screen 
        name="AddPaymentMethod" 
        component={AddPaymentMethodScreen}
        options={{
          title: 'Add Payment Method',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
  />
      <Stack.Screen 
        name="Support" 
        component={SupportScreen}
        options={{
          title: 'Help & Support',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <Stack.Screen 
        name="Terms" 
        component={TermsScreen}
        options={{
          title: 'Terms & Conditions',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <Stack.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{
          title: 'Privacy Policy',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />

      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{
          title: 'About Us',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
        }}
      />
      <Stack.Screen 
       name="Logout" 
       component={LogoutScreen}
       options={{ 
       headerShown: false 
      }}
      />
    </Stack.Navigator>
    
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <UserProvider>
          <WishlistProvider>
            <CartProvider>
              <ProductProvider>
                <RootStack />
                <TestConnection />
              </ProductProvider>
            </CartProvider>
          </WishlistProvider>
        </UserProvider>
      </NavigationContainer>
    </AuthProvider>
  );
}