import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

export type ProductDetails = Product & {
  shop: {
    id: string;
    name: string;
    rating: number;
    location: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user: {
      full_name: string;
      avatar_url?: string;
    };
  }>;
};

export function useProductDetails(productId: string) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load product details with shop and reviews
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          shop:shops(
            id,
            name,
            rating,
            location
          ),
          reviews:reviews(
            id,
            rating,
            comment,
            created_at,
            user:profiles(
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Load related products from same shop and category
      if (productData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select(`
            *,
            shop:shops(
              name,
              rating
            )
          `)
          .neq('id', productId)
          .eq('shop_id', productData.shop_id)
          .eq('category', productData.category)
          .limit(4);

        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData.user) throw new Error('User must be logged in to review');

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          shop_id: product?.shop.id,
          user_id: userData.user.id,
          rating,
          comment,
        });

      if (reviewError) throw reviewError;
      await loadProduct(); // Reload product to get updated reviews
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  const getAverageRating = () => {
    if (!product?.reviews?.length) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  const getRatingCounts = () => {
    if (!product?.reviews?.length) return Array(5).fill(0);
    const counts = Array(5).fill(0);
    product.reviews.forEach(review => {
      counts[review.rating - 1]++;
    });
    return counts;
  };

  return {
    product,
    relatedProducts,
    loading,
    error,
    addReview,
    getAverageRating,
    getRatingCounts,
    refresh: loadProduct,
  };
} 