import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Create a custom storage implementation that handles SSR
const ExpoSecureStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    return AsyncStorage.removeItem(key);
  },
};

// Create Supabase client with SSR configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStorage,
    autoRefreshToken: true,
    persistSession: typeof window !== 'undefined', // Only persist session in browser
    detectSessionInUrl: false,
  },
});

// Types for your database tables
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  location: string;
  category: string;
  rating: number;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  stock: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  shop_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  user_id: string;
  shop_id: string;
  product_id?: string;
  rating: number;
  comment: string;
  created_at: string;
} 