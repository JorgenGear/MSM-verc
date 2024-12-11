import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image_url?: string;
  shop_id: string;
  shop_name: string;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading cart data...');
      const cartData = await AsyncStorage.getItem(`cart_${session?.user?.id || 'guest'}`);
      if (cartData) {
        const parsedData = JSON.parse(cartData);
        console.log('Cart data loaded:', parsedData);
        setItems(parsedData);
      } else {
        console.log('No cart data found, initializing empty cart.');
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Load cart immediately when component mounts or user changes
  useEffect(() => {
    console.log('useCart effect triggered.');
    loadCart();
  }, [loadCart]);

  const saveCart = async (newItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem(
        `cart_${session?.user?.id || 'guest'}`,
        JSON.stringify(newItems)
      );
      setItems(newItems);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      // Get product details
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          shop:shops(
            id,
            name
          )
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      if (!product) throw new Error('Product not found');

      const existingItem = items.find(item => item.productId === productId);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${Date.now()}`,
          productId,
          quantity,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          shop_id: product.shop.id,
          shop_name: product.shop.name,
        };
        newItems = [...items, newItem];
      }

      await saveCart(newItems);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      if (quantity < 1) {
        await removeItem(itemId);
        return;
      }

      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      await saveCart(newItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const newItems = items.filter(item => item.id !== itemId);
      await saveCart(newItems);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await saveCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getShopItems = useCallback((shopId: string) => {
    return items.filter(item => item.shop_id === shopId);
  }, [items]);

  const mergeGuestCart = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const guestCartData = await AsyncStorage.getItem('cart_guest');
      if (guestCartData) {
        const guestItems = JSON.parse(guestCartData);
        const newItems = [...items, ...guestItems];
        await saveCart(newItems);
        await AsyncStorage.removeItem('cart_guest');
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount,
    getShopItems,
    mergeGuestCart,
    loadCart,
  };
} 