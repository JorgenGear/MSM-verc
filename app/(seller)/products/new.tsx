import { Stack } from 'expo-router';
import { Pressable, TextInput, View, Button, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Ensure you have supabase set up
import { useAuth } from '@/providers/AuthProvider';

export default function AddProduct() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // State for product form
  const [shopId, setShopId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('assets/images/product.png'); // Default image
  const [stock, setStock] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const { session } = useAuth();

  // Fetch shop_id based on current user
  useEffect(() => {
    const fetchShopId = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('shops')
          .select('id')
          .eq('owner_id', session?.user.id)
          .single();

        if (error) {
          console.error('Error fetching shop ID:', error);
        } else {
          setShopId(data?.id || '');
        }
      }
    };

    fetchShopId();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const { error } = await supabase
      .from('products')
      .insert([
        {
          shop_id: shopId,
          name,
          description,
          price: parseFloat(price),
          category,
          image_url: imageUrl,
          stock,
          created_at: createdAt,
        },
      ]);

    if (error) {
      console.error('Error adding product:', error);
    } else {
      // Reset form or navigate
      console.log('Product added successfully');
      // Optionally reset the form fields
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setStock(0);
      setCreatedAt(new Date().toISOString());
    }
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{ marginLeft: 15 }}>
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
        ),
      }}>
      <Stack.Screen
        name="add-product"
        options={{
          title: 'Add Product',
        }}
      />
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
        <TextInput
          placeholder="Stock"
          value={String(stock)}
          onChangeText={(value) => setStock(Number(value))}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Product" onPress={handleSubmit} />
      </View>
    </Stack>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
