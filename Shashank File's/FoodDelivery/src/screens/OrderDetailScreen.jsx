import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';

const OrderDetailScreen = ({ route }) => {
  const { order } = route.params;
  
  // Status color configuration
  const statusColors = {
    Delivered: '#D1FAE5',
    Processing: '#FEF3C7',
    Cancelled: '#FEE2E2',
    Shipped: '#DBEAFE'
  };

  // Item renderer for ordered items
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  // Distance calculation using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    try {
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      
      return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
    } catch (error) {
      console.error('Distance calculation error:', error);
      return 'N/A';
    }
  };

  // Memoized coordinate calculations
  const { userCoords, restaurantCoords, distance } = useMemo(() => {
    try {
      const userLat = parseFloat(order.address?.latitude || 0);
      const userLon = parseFloat(order.address?.longitude || 0);
      const restLat = parseFloat(order.restaurant?.latitude || 0);
      const restLon = parseFloat(order.restaurant?.longitude || 0);

      return {
        userCoords: { latitude: userLat, longitude: userLon },
        restaurantCoords: { latitude: restLat, longitude: restLon },
        distance: calculateDistance(userLat, userLon, restLat, restLon)
      };
    } catch (error) {
      console.error('Coordinate parsing error:', error);
      return {
        userCoords: { latitude: 0, longitude: 0 },
        restaurantCoords: { latitude: 0, longitude: 0 },
        distance: 'N/A'
      };
    }
  }, [order]);

  // Map region calculation with fallback
  const mapRegion = useMemo(() => {
    try {
      if (userCoords.latitude === 0 && restaurantCoords.latitude === 0) {
        return {
          latitude: 18.59977330,
          longitude: 73.73463500,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
      }
      return {
        latitude: (userCoords.latitude + restaurantCoords.latitude) / 2,
        longitude: (userCoords.longitude + restaurantCoords.longitude) / 2,
        latitudeDelta: Math.abs(userCoords.latitude - restaurantCoords.latitude) * 2,
        longitudeDelta: Math.abs(userCoords.longitude - restaurantCoords.longitude) * 2,
      };
    } catch (error) {
      console.error('Map region calculation error:', error);
      return {
        latitude: 18.59977330,
        longitude: 73.73463500,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }
  }, [userCoords, restaurantCoords]);

  // Delivery time estimation with validation
  const estimatedDeliveryTime = useMemo(() => {
    try {
      const orderTime = new Date(order.createdAt);
      if (isNaN(orderTime)) throw new Error('Invalid order date');
      
      const numericDistance = parseFloat(distance);
      if (isNaN(numericDistance)) return 'Calculating...';

      const travelTime = (numericDistance / 30) * 60; // 30 km/h average speed
      const deliveryDate = new Date(orderTime.getTime() + (20 + travelTime) * 60000);
      
      return deliveryDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      console.error('Time estimation error:', error);
      return 'N/A';
    }
  }, [distance, order.createdAt]);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Order Details</Text>
        <View style={[styles.statusPill, { backgroundColor: statusColors[order.status] }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      {/* Delivery Tracking Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="local-shipping" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Delivery Tracking</Text>
        </View>
        
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion}>
            <Marker
              coordinate={userCoords}
              title="Delivery Address"
              description={order.address?.line || 'Address not available'}
              pinColor="#6366F1"
            />
            <Marker
              coordinate={restaurantCoords}
              title={order.restaurant?.name || 'Restaurant'}
              description={order.restaurant?.address || 'Address not available'}
              pinColor="#10B981"
            />
          </MapView>
        </View>

        <View style={styles.deliveryInfoContainer}>
          <DetailRow 
            icon="access-time" 
            label="Estimated Delivery" 
            value={estimatedDeliveryTime}
          />
          <DetailRow 
            icon="map" 
            label="Distance" 
            value={`${distance} km`}
          />
        </View>
      </View>

      {/* Order Information Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="receipt" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Order Information</Text>
        </View>
        <DetailRow icon="tag" label="Order ID" value={order.orderId?.toString() || 'N/A'} />
        <DetailRow icon="payment" label="Payment Method" value={order.paymentMethod || 'N/A'} />
        <DetailRow 
          icon="currency-rupee" 
          label="Total Amount" 
          value={order.totalAmount ? `₹${order.totalAmount}` : 'N/A'} 
        />
        <DetailRow 
          icon="event" 
          label="Order Date" 
          value={new Date(order.createdAt).toLocaleDateString() || 'N/A'} 
        />
      </View>

      {/* Restaurant Details Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="restaurant" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Restaurant Details</Text>
        </View>
        <DetailRow 
          icon="store" 
          label="Name" 
          value={order.restaurant?.name || 'N/A'} 
        />
        <DetailRow 
          icon="place" 
          label="Address" 
          value={order.restaurant?.address || 'N/A'} 
        />
      </View>

      {/* Delivery Address Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="location-on" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Delivery Address</Text>
        </View>
        <DetailRow 
          icon="map" 
          label="Address" 
          value={order.address?.line || 'N/A'} 
        />
        <DetailRow 
          icon="location-city" 
          label="City" 
          value={order.address?.city || 'N/A'} 
        />
      </View>

      {/* Ordered Items Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Icon name="list-alt" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Ordered Items</Text>
        </View>
        {order.items?.length > 0 ? (
          <FlatList
            data={order.items}
            keyExtractor={(item) => item.itemId?.toString() || Math.random().toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="error-outline" size={24} color="#E5E7EB" />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Reusable Detail Row Component
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={18} color="#94A3B8" />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  header: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937'
  },
  card: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  detailTextContainer: {
    marginLeft: 16
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginBottom: 2
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter-Medium'
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
  itemContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    flex: 2
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937'
  },
  itemQuantity: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B'
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 8,
    fontFamily: 'Inter-Medium'
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
});

export default OrderDetailScreen;