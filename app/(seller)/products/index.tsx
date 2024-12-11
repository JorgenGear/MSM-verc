import { StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';
import { Product } from '@/lib/supabase';

export default function ProductManagement() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      router.replace('/(auth)/login');
      return;
    }
    loadSellerProducts();
  }, [session]);

  const loadSellerProducts = async () => {
    try {
      setLoading(true);
      
      // Get seller's shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', session?.user?.id)
        .single();

      if (shopError) throw shopError;
      setShopId(shop.id);

      // Get products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error loading products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ThemedView style={[styles.productCard, { backgroundColor: colors.background }]}>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      <ThemedView style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        <ThemedText style={styles.productPrice}>${item.price}</ThemedText>
        <ThemedText style={styles.productStock}>Stock: {item.stock}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.productActions}>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/products/${item.id}/edit`)}>
          <IconSymbol name="pencil" size={20} color="#ffffff" />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={() => handleDeleteProduct(item.id)}>
          <IconSymbol name="trash" size={20} color="#ffffff" />
        </Pressable>
      </ThemedView>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>Products</ThemedText>
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.background }]}
          onPress={() => router.push('/products/new')}>
          <IconSymbol name="plus" size={20} color={colors.primary} />
          <ThemedText style={[styles.addButtonText, { color: colors.primary }]}>
            Add Product
          </ThemedText>
        </Pressable>
      </ThemedView>

      {products.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="cube.box" size={48} color={colors.icon} />
          <ThemedText style={styles.emptyStateText}>
            No products yet. Add your first product to start selling!
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  productList: {
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    opacity: 0.7,
  },
  productActions: {
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
}); 