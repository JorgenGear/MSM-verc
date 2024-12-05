import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Product } from '@/lib/supabase';

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
};

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      loadWishlist();
    }
  }, [session?.user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(
            *,
            shop:shops(
              name,
              rating,
              location
            )
          )
        `)
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      if (!session?.user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: session.user.id,
          product_id: productId,
        })
        .select(`
          *,
          product:products(
            *,
            shop:shops(
              name,
              rating,
              location
            )
          )
        `)
        .single();

      if (error) throw error;
      setItems([data, ...items]);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (!session?.user) throw new Error('User must be logged in');

      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId);

      if (error) throw error;
      setItems(items.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
  };
} 