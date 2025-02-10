import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Retrieve the stored user object and token
        const userString = await AsyncStorage.getItem('user');
        if (!userString) {
          console.error('User data not found');
          setLoading(false);
          return;
        }
        const userData = JSON.parse(userString);
        const token = userData.token; // Make sure your user object includes the token

        // Fetch orders from your backend
        const response = await client.get('/orders', {
        });
        console.log('Orders response:', response.data);
        setOrders(response.data);
      } catch (error) { 
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }; 

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { order: item })}
      activeOpacity={0.9}
    >
      <View style={styles.orderHeader}>
        <Icon name="local-shipping" size={20} color="#6C757D" />
        <Text style={styles.orderId}>ORDER #${item.orderId}</Text>
      </View>
      
      <View style={styles.orderDetails}>
        <View>
          <Text style={styles.detailLabel}>Status</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.amountText}>₹{item.totalAmount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="assignment" size={60} color="#E5E7EB" />
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const statusColors = {
  Delivered: '#D1FAE5',
  Processing: '#FEF3C7',
  Cancelled: '#FEE2E2',
  Shipped: '#DBEAFE'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
    paddingHorizontal: 24,
    paddingTop: 40
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 24
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12
  },
  orderId: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    fontFamily: 'Inter-Medium'
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
    fontFamily: 'Inter-Regular'
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    textTransform: 'capitalize'
  },
  amountContainer: {
    alignItems: 'flex-end'
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    fontFamily: 'Inter-Medium'
  },
  listContent: {
    paddingBottom: 24
  }
});

export default OrderScreen;