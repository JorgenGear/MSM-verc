import { StyleSheet, ScrollView, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

export default function ProductForm() {
  const { id } = useLocalSearchParams();
  const isEditing = id !== 'new';
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
  });

  useEffect(() => {
    if (!session?.user) {
      router.replace('/(auth)/login');
      return;
    }
    loadInitialData();
  }, [session, id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Get seller's shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id')
        .eq('seller_id', session?.user?.id)
        .single();

      if (shopError) throw shopError;
      setShopId(shop.id);

      if (isEditing) {
        // Load product data
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          image_url: product.image_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setLoading(true);
        const base64FileData = result.assets[0].base64;
        const fileName = `${Date.now()}.jpg`;
        const filePath = `product-images/${fileName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, decode(base64FileData), {
            contentType: 'image/jpeg',
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        setFormData({ ...formData, image_url: publicURL.publicUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        shop_id: shopId,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }

      router.back();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={[styles.header, { backgroundColor: colors.primary }]}>
        <ThemedText style={styles.headerTitle}>
          {isEditing ? 'Edit Product' : 'New Product'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.form}>
        <Pressable
          style={[styles.imageUpload, { backgroundColor: colors.background }]}
          onPress={handleImagePick}>
          {formData.image_url ? (
            <Image
              source={{ uri: formData.image_url }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <>
              <IconSymbol name="photo" size={32} color={colors.icon} />
              <ThemedText style={styles.imageUploadText}>
                Upload Product Image
              </ThemedText>
            </>
          )}
        </Pressable>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Product Name</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Product name"
            placeholderTextColor={colors.icon}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.textArea, { backgroundColor: colors.background }]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Product description"
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Price</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="0.00"
            placeholderTextColor={colors.icon}
            keyboardType="decimal-pad"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Category</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.category}
            onChangeText={(text) => setFormData({ ...formData, category: text })}
            placeholder="Product category"
            placeholderTextColor={colors.icon}
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Stock</ThemedText>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background }]}
            value={formData.stock}
            onChangeText={(text) => setFormData({ ...formData, stock: text })}
            placeholder="0"
            placeholderTextColor={colors.icon}
            keyboardType="number-pad"
          />
        </ThemedView>

        <Pressable
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.submitButtonText}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  form: {
    padding: 20,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageUploadText: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 