import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Image, Animated, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchHeader } from '@/components/SearchHeader';

const GIFT_CARD_AMOUNTS = [25, 50, 75, 100, 150, 200];

const GIFT_CARD_DESIGNS = [
  { id: '1', name: 'Birthday Celebration', image: require('@/assets/images/partial-react-logo.png') },
  { id: '2', name: 'Thank You', image: require('@/assets/images/partial-react-logo.png') },
  { id: '3', name: 'Congratulations', image: require('@/assets/images/partial-react-logo.png') },
  { id: '4', name: 'Holiday Season', image: require('@/assets/images/partial-react-logo.png') },
];

const CATEGORIES = [
  { id: '1', name: 'Restaurants', icon: 'fork.knife' },
  { id: '2', name: 'Shopping', icon: 'bag' },
  { id: '3', name: 'Services', icon: 'wrench.and.screwdriver' },
  { id: '4', name: 'Entertainment', icon: 'ticket' },
];

export default function GiftCardsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedAmount, setSelectedAmount] = useState(GIFT_CARD_AMOUNTS[0]);
  const [selectedDesign, setSelectedDesign] = useState(GIFT_CARD_DESIGNS[0]);
  const scaleAnim = new Animated.Value(1);

  const handlePurchase = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Alert.alert(
        'Purchase Gift Card',
        `Would you like to purchase a $${selectedAmount} gift card with the ${selectedDesign.name} design?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Purchase',
            onPress: () => router.push('/checkout'),
          },
        ]
      );
    });
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Gift Cards' }} />
      <SearchHeader />

      <ScrollView style={styles.content}>
        {/* Featured Gift Card */}
        <Animated.View style={[styles.featuredCard, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={selectedDesign.image}
            style={[styles.featuredImage, { backgroundColor: colors.cardBackground }]}
          />
          <ThemedView style={styles.amountBadge}>
            <ThemedText style={styles.amountText}>${selectedAmount}</ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Amount Selection */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Select Amount</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ThemedView style={styles.amountContainer}>
              {GIFT_CARD_AMOUNTS.map((amount) => (
                <Pressable
                  key={amount}
                  style={[
                    styles.amountButton,
                    {
                      backgroundColor:
                        selectedAmount === amount ? colors.primary : colors.lightGray,
                    },
                  ]}
                  onPress={() => setSelectedAmount(amount)}>
                  <ThemedText
                    style={[
                      styles.amountButtonText,
                      {
                        color: selectedAmount === amount ? '#ffffff' : colors.mediumGray,
                      },
                    ]}>
                    ${amount}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ScrollView>
        </ThemedView>

        {/* Design Selection */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Choose a Design</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {GIFT_CARD_DESIGNS.map((design) => (
              <Pressable
                key={design.id}
                style={[
                  styles.designCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: selectedDesign.id === design.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedDesign(design)}>
                <Image source={design.image} style={styles.designImage} />
                <ThemedText style={styles.designName}>{design.name}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Categories */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Shop by Category</ThemedText>
          <ThemedView style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => router.push(`/category/${category.id}`)}>
                <IconSymbol name={category.icon} size={24} color={colors.primary} />
                <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Purchase Button */}
        <Pressable
          style={[styles.purchaseButton, { backgroundColor: colors.secondary }]}
          onPress={handlePurchase}>
          <ThemedText style={styles.purchaseButtonText}>
            Buy ${selectedAmount} Gift Card
          </ThemedText>
        </Pressable>

        {/* Info Section */}
        <ThemedView style={[styles.infoSection, { backgroundColor: colors.lightGray }]}>
          <IconSymbol name="info.circle" size={20} color={colors.icon} />
          <ThemedText style={styles.infoText}>
            Gift cards are delivered by email and contain instructions to redeem them at checkout.
            Support your local businesses by gifting their products and services.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  featuredCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  amountBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  amountText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  amountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  amountButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  designCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
  },
  designImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  designName: {
    fontSize: 14,
    fontWeight: '500',
    padding: 8,
    textAlign: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  purchaseButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  infoSection: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
}); 