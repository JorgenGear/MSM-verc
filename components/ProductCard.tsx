import { StyleSheet, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useWishlistContext } from '@/providers/WishlistProvider';
import { Product } from '@/lib/supabase';

type Props = {
  product: Product & {
    shop?: {
      name: string;
      rating: number;
    };
  };
  variant?: 'grid' | 'list';
};

export function ProductCard({ product, variant = 'grid' }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));

  const handleWishlist = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (variant === 'list') {
    return (
      <Pressable
        style={[styles.listCard, { backgroundColor: colors.background }]}
        onPress={() => router.push(`/product/${product.id}`)}>
        {product.image_url && (
          <Image source={{ uri: product.image_url }} style={styles.listImage} resizeMode="cover" />
        )}
        <ThemedView style={styles.listContent}>
          <ThemedText style={styles.name} numberOfLines={2}>
            {product.name}
          </ThemedText>
          <ThemedText style={styles.price}>${product.price}</ThemedText>
          {product.shop && (
            <ThemedView style={styles.shopInfo}>
              <ThemedText style={styles.shopName}>{product.shop.name}</ThemedText>
              <ThemedView style={styles.rating}>
                <IconSymbol name="star.fill" size={12} color={colors.secondary} />
                <ThemedText style={styles.ratingText}>
                  {product.shop.rating.toFixed(1)}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          <Pressable style={styles.wishlistButton} onPress={handleWishlist}>
            <IconSymbol
              name={inWishlist ? 'heart.fill' : 'heart'}
              size={20}
              color={inWishlist ? colors.error : colors.icon}
            />
          </Pressable>
        </ThemedView>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.gridCard, { backgroundColor: colors.background }]}
      onPress={() => router.push(`/product/${product.id}`)}>
      {product.image_url && (
        <Image source={{ uri: product.image_url }} style={styles.gridImage} resizeMode="cover" />
      )}
      <ThemedView style={styles.gridContent}>
        <ThemedText style={styles.name} numberOfLines={2}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.price}>${product.price}</ThemedText>
        {product.shop && (
          <ThemedView style={styles.shopInfo}>
            <ThemedText style={styles.shopName} numberOfLines={1}>
              {product.shop.name}
            </ThemedText>
            <ThemedView style={styles.rating}>
              <IconSymbol name="star.fill" size={12} color={colors.secondary} />
              <ThemedText style={styles.ratingText}>{product.shop.rating.toFixed(1)}</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
        <Pressable style={styles.wishlistButton} onPress={handleWishlist}>
          <IconSymbol
            name={inWishlist ? 'heart.fill' : 'heart'}
            size={20}
            color={inWishlist ? colors.error : colors.icon}
          />
        </Pressable>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 200,
  },
  gridContent: {
    padding: 12,
  },
  listCard: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listImage: {
    width: 120,
    height: 120,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopName: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
  },
}); 