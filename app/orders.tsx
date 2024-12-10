import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

// Dummy data for demonstration
const DUMMY_ORDERS = [
  {
    id: 'ord-001',
    date: 'February 15, 2024',
    total: '$45.99',
    status: 'Delivered',
    items: [
      { name: 'Organic Local Honey', quantity: 1, price: '$15.99' },
      { name: 'Artisan Bread', quantity: 2, price: '$30.00' }
    ]
  },
  {
    id: 'ord-002',
    date: 'February 10, 2024',
    total: '$67.50',
    status: 'In Transit',
    items: [
      { name: 'Farm Fresh Eggs', quantity: 2, price: '$12.50' },
      { name: 'Local Cheese Selection', quantity: 1, price: '$55.00' }
    ]
  }
];

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all'); // all, delivered, processing

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#0A8554'; // success green
      case 'in transit':
        return '#FFB000'; // warning yellow
      default:
        return colors.text;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filters */}
      <ThemedView style={styles.filtersContainer}>
        {['All', 'Delivered', 'Processing'].map((filter) => (
          <Pressable
            key={filter}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === filter.toLowerCase()
                    ? colors.primary
                    : colors.background,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveFilter(filter.toLowerCase())}
          >
            <ThemedText
              style={[
                styles.filterText,
                {
                  color:
                    activeFilter === filter.toLowerCase()
                      ? '#fff'
                      : colors.primary,
                },
              ]}
            >
              {filter}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>

      {/* Orders List */}
      <ThemedView style={styles.ordersContainer}>
        {DUMMY_ORDERS.map((order) => (
          <Pressable
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.productCardBackground }]}
            onPress={() => router.push(`/order/${order.id}`)}
          >
            <View style={styles.orderHeader}>
              <View>
                <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
                <ThemedText style={styles.orderId}>Order #{order.id}</ThemedText>
              </View>
              <View>
                <ThemedText style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </ThemedText>
              </View>
            </View>

            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemQuantity}>Qty: {item.quantity}</ThemedText>
                  </View>
                  <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <ThemedText style={styles.totalText}>Total</ThemedText>
              <ThemedText style={styles.totalAmount}>{order.total}</ThemedText>
            </View>

            <Pressable
              style={[styles.viewDetailsButton, { borderColor: colors.primary }]}
              onPress={() => router.push(`/order/${order.id}`)}
            >
              <ThemedText style={[styles.viewDetailsText, { color: colors.primary }]}>
                View Order Details
              </ThemedText>
              <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            </Pressable>
          </Pressable>
        ))}
      </ThemedView>

      {/* Empty State */}
      {DUMMY_ORDERS.length === 0 && (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="box.fill" size={48} color={colors.text} />
          <ThemedText style={styles.emptyStateTitle}>No Orders Yet</ThemedText>
          <ThemedText style={styles.emptyStateText}>
            When you place orders, they will appear here
          </ThemedText>
          <Pressable
            style={[styles.browseButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/browse')}
          >
            <ThemedText style={styles.browseButtonText}>Browse Products</ThemedText>
          </Pressable>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ordersContainer: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderId: {
    fontSize: 14,
    opacity: 0.7,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 12,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: 12,
    opacity: 0.7,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});