import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

export type ProductFilter = {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  shopId?: string;
  rating?: number;
  inStock?: boolean;
  localPickupOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  searchQuery?: string;
};

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const searchProducts = async (filters: ProductFilter, page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select(`
          *,
          shop:shops(
            name,
            rating,
            location
          ),
          reviews:reviews(rating)
        `, { count: 'exact' });

      // Apply filters
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.shopId) {
        query = query.eq('shop_id', filters.shopId);
      }
      if (filters.inStock) {
        query = query.gt('stock', 0);
      }
      if (filters.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      // Calculate average rating for each product
      const productsWithRating = data?.map(product => ({
        ...product,
        averageRating: product.reviews?.length
          ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
          : 0,
      })) || [];

      // Filter by rating if specified
      const filteredProducts = filters.rating
        ? productsWithRating.filter(product => product.averageRating >= filters.rating!)
        : productsWithRating;

      setProducts(filteredProducts);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching products');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  };

  const getPriceRange = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('price')
        .order('price', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        return {
          min: Math.floor(data[0].price),
          max: Math.ceil(data[data.length - 1].price),
        };
      }
      return { min: 0, max: 1000 };
    } catch (err) {
      console.error('Error fetching price range:', err);
      return { min: 0, max: 1000 };
    }
  };

  return {
    products,
    loading,
    error,
    totalCount,
    searchProducts,
    getCategories,
    getPriceRange,
  };
} 