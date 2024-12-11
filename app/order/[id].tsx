import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

// Dummy data - replace with actual data fetching
const DUMMY_ORDER = {
  id: 'ord-001',
  date: 'February 15, 2024',
  total: '$45.99',
  status: 'Delivered',
  deliveryAddress: {
    name: 'Rifat Ibn Alam',
    street: '123 Main Street',
    city: 'Logan',
    state: 'UT',
    zip: '84321',
    phone: '(435) 123-4567'
  },
  paymentMethod: {
    type: 'Credit Card',
    last4: '4242',
    brand: 'Visa'
  },
  items: [
    { 
      name: 'Organic Local Honey',
      quantity: 1,
      price: '$15.99',
      seller: "Nature's Best",
      image: '/api/placeholder/80/80'
    },
    { 
      name: 'Artisan Bread',
      quantity: 2,
      price: '$30.00',
      seller: 'Logan Bakery',
      image: '/api/placeholder/80/80'
    }
  ],
  timeline: [
    { status: 'Delivered', date: 'Dec 10, 2024 2:30 PM', description: 'Package delivered' },
    { status: 'Out for Delivery', date: 'Dec 09, 2024 9:00 AM', description: 'Package is out for delivery' },
    { status: 'Shipped', date: 'Dec 08, 2024 3:45 PM', description: 'Order has been shipped' },
    { status: 'Processing', date: 'Dec 07, 2024 10:15 AM', description: 'Order is being processed' },
    { status: 'Order Placed', date: 'Dec 06, 2024 10:00 AM', description: 'Order confirmed' }
  ]
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#0A8554';
      case 'out for delivery':
        return '#FFB000';
      case 'shipped':
        return '#435585';
      default:
        return colors.text;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <ThemedView style={[styles.section, styles.headerSection]}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
          <ThemedText style={styles.backText}>Back to Orders</ThemedText>
        </Pressable>
        
        <View style={styles.orderInfo}>
          <ThemedText style={styles.orderId}>Order #{DUMMY_ORDER.id}</ThemedText>
          <ThemedText style={styles.orderDate}>Placed on {DUMMY_ORDER.date}</ThemedText>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(DUMMY_ORDER.status) + '20' }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(DUMMY_ORDER.status) }]}>
                {DUMMY_ORDER.status}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>

      {/* Order Timeline */}
      <ThemedView style={[styles.section, styles.timelineSection]}>
        <ThemedText style={styles.sectionTitle}>Order Timeline</ThemedText>
        {DUMMY_ORDER.timeline.map((event, index) => (
          <View key={index} style={styles.timelineEvent}>
            <View style={[styles.timelineDot, { backgroundColor: getStatusColor(event.status) }]} />
            <View style={styles.timelineContent}>
              <ThemedText style={styles.timelineStatus}>{event.status}</ThemedText>
              <ThemedText style={styles.timelineDate}>{event.date}</ThemedText>
              <ThemedText style={styles.timelineDescription}>{event.description}</ThemedText>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Items Section */}
      <ThemedView style={[styles.section, styles.itemsSection]}>
        <ThemedText style={styles.sectionTitle}>Order Items</ThemedText>
        {DUMMY_ORDER.items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <img 
              src={item.image} 
              alt={item.name}
              style={{ width: 80, height: 80, borderRadius: 8 }}
            />
            <View style={styles.itemDetails}>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemSeller}>Sold by: {item.seller}</ThemedText>
              <View style={styles.itemPriceRow}>
                <ThemedText style={styles.itemQuantity}>Qty: {item.quantity}</ThemedText>
                <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ThemedView>

      {/* Shipping Address */}
      <ThemedView style={[styles.section, styles.addressSection]}>
        <ThemedText style={styles.sectionTitle}>Shipping Address</ThemedText>
        <ThemedText style={styles.addressName}>{DUMMY_ORDER.deliveryAddress.name}</ThemedText>
        <ThemedText style={styles.addressText}>{DUMMY_ORDER.deliveryAddress.street}</ThemedText>
        <ThemedText style={styles.addressText}>
          {DUMMY_ORDER.deliveryAddress.city}, {DUMMY_ORDER.deliveryAddress.state} {DUMMY_ORDER.deliveryAddress.zip}
        </ThemedText>
        <ThemedText style={styles.addressText}>{DUMMY_ORDER.deliveryAddress.phone}</ThemedText>
      </ThemedView>

      {/* Payment Information */}
      <ThemedView style={[styles.section, styles.paymentSection]}>
        <ThemedText style={styles.sectionTitle}>Payment Information</ThemedText>
        <View style={styles.paymentDetails}>
          <IconSymbol name="creditcard.fill" size={24} color={colors.text} />
          <View style={styles.paymentText}>
            <ThemedText style={styles.paymentMethod}>
              {DUMMY_ORDER.paymentMethod.brand} ending in {DUMMY_ORDER.paymentMethod.last4}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Order Summary */}
      <ThemedView style={[styles.section, styles.summarySection]}>
        <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryText}>Items Total</ThemedText>
          <ThemedText style={styles.summaryAmount}>{DUMMY_ORDER.total}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={styles.summaryText}>Shipping</ThemedText>
          <ThemedText style={styles.summaryAmount}>Free</ThemedText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText style={styles.totalText}>Order Total</ThemedText>
          <ThemedText style={styles.totalAmount}>{DUMMY_ORDER.total}</ThemedText>
        </View>
      </ThemedView>

      {/* Action Buttons */}
      <ThemedView style={[styles.section, styles.actionsSection]}>

        <Pressable 
          style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.primary, borderWidth: 1 }]}
          onPress={() => router.push('/buy-again')}
        >
          <IconSymbol name="arrow.clockwise" size={20} color={colors.primary} />
          <ThemedText style={[styles.actionButtonText, { color: colors.primary }]}>Buy Again</ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  headerSection: {
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
  orderInfo: {
    gap: 4,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timelineSection: {
    gap: 16,
  },
  timelineEvent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 2,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  timelineDescription: {
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSeller: {
    fontSize: 14,
    opacity: 0.7,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentText: {
    gap: 2,
  },
  paymentMethod: {
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
  },
  summaryAmount: {
    fontSize: 14,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});