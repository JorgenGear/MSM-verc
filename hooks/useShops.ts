import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shop } from '@/lib/supabase';

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          owner:profiles(
            username,
            full_name
          ),
          products:products(count)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getShopsByCategory = async (category: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          owner:profiles(
            username,
            full_name
          ),
          products:products(count)
        `)
        .eq('category', category)
        .order('rating', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const searchShops = async (query: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          owner:profiles(
            username,
            full_name
          ),
          products:products(count)
        `)
        .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
        .order('rating', { ascending: false });

      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return {
    shops,
    loading,
    error,
    fetchShops,
    getShopsByCategory,
    searchShops,
  };
} 