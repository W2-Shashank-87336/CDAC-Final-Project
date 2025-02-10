import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Alert, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import client from '../api/client';
import * as Location from 'expo-location';
import { addToCart, decreaseQuantity,clearCart } from '../redux/cartReducer';
import { getUser } from '../redux/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const userData = useSelector(getUser);
  const itemsArray = Object.values(cartItems).filter(item => item.quantity > 0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Track selected address

  const calculateTotal = () =>
    itemsArray.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  useEffect(() => {
    if (userData?.id) {
      getSavedAddress();
    }
    
  }, [userData?.id]);

  const getSavedAddress = async () => {
    try {
      setLoading(true);
      const response = await client.get('/profile/addresses', {
        params: { userId: userData.id }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load saved addresses');
    } finally {
      setLoading(false);
    }
  };
  const placeOrder = async () => {
    // Ensure a delivery address is selected
    if (!selectedAddressId) {
      Alert.alert('Error', 'Please select a delivery address.');
      return;
    }

    // Ensure there are items in the cart
    if (itemsArray.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }

    // Assume that all items come from the same restaurant.
    const restaurantId = itemsArray[0].restaurantId;
    // Optional: Verify all items are from the same restaurant.
    const allSameRestaurant = itemsArray.every(item => item.restaurantId === restaurantId);
    if (!allSameRestaurant) {
      Alert.alert('Error', 'All items in the cart must be from the same restaurant.');
      return;
    }

    // Transform cart items to the backend format: { itemId, quantity }
    const orderItems = itemsArray.map(item => ({
      itemId: item.id, // use item.id as the item identifier
      quantity: item.quantity
    }));

    // Prepare order data (couponId is set to null and paymentMethod hard-coded, adjust as needed)
    const orderData = {
      restaurantId,
      addressId: selectedAddressId,
      couponId: null,
      paymentMethod: 'COD',
      items: orderItems,
      total:calculateTotal()
    };

    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      
      // Send POST request to your backend endpoint
      const response = await client.post('/orders', orderData);

      console.log('Order placed successfully:', response.data);
      Alert.alert('Success', 'Your order has been placed successfully!');
      // Optionally, clear the cart after a successful order
      dispatch(clearCart());
      navigation.navigate("Orders");
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      Alert.alert(
        'Order Failed',
        error.response?.data?.error || 'Failed to place order. Please try again.'
      );
    }
  };

  const handleAddAddress = async () => {
    if (!address.trim() || !city.trim()) {
      Alert.alert('Error', 'Please fill in both Address and City.');
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.High 
      });
      
      console.log(userData);
      await client.post('/profile/addresses', {
        userId: userData.id,
        addressLine1: address,
        city,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString()
      });

      await getSavedAddress();
      setAddress('');
      setCity('');
      setShowAddressModal(false);
      Alert.alert('Success', 'Address added successfully!');
    } catch (error) {
      console.error('Address submission error:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };
  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => dispatch(decreaseQuantity(item.id))}
          style={styles.quantityButton}
        >
          <Icon name="remove" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity
          onPress={() => dispatch(addToCart(item))}
          style={styles.quantityButton}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddressId === item.id && styles.selectedAddressCard
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <View style={styles.addressRadio}>
        <Icon 
          name={selectedAddressId === item.id ? "radio-button-checked" : "radio-button-unchecked"} 
          size={20} 
          color="#6366F1" 
        />
      </View>
      <View style={styles.addressDetails}>
        <Text style={styles.addressText}>{item.addressLine1}</Text>
        <Text style={styles.cityText}>{item.city}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="shopping-cart" size={28} color="#1F2937" />
        <Text style={styles.header}>Your Cart</Text>
      </View>

      {itemsArray.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="remove-shopping-cart" size={64} color="#E5E7EB" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={itemsArray}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Delivery Address</Text>
                  <TouchableOpacity
                    style={styles.addAddressButton}
                    onPress={() => setShowAddressModal(true)}
                  >
                    <Icon name="add" size={20} color="#6366F1" />
                    <Text style={styles.addAddressText}>Add New</Text>
                  </TouchableOpacity>
                </View>

                {addresses.length > 0 ? (
                  <FlatList
                    data={addresses}
                    scrollEnabled={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAddressItem}
                  />
                ) : (
                  <Text style={styles.noAddressText}>No saved addresses found</Text>
                )}

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
                </View>
              </>
            }
          />

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={placeOrder}
            disabled={!selectedAddressId}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.checkoutText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="location-on" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor="#94A3B8"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="location-city" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#94A3B8"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
    paddingHorizontal: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  continueButton: {
    marginTop: 16,
    padding: 16,
  },
  continueText: {
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 6,
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 8,
  },
  quantityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  addAddressText: {
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedAddressCard: {
    borderWidth: 2,
    borderColor: '#6366F1',
    backgroundColor: '#F8FAFC',
  },
  addressRadio: {
    marginRight: 16,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  cityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  noAddressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  totalAmount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  checkoutButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginVertical: 16,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748B',
    fontFamily: 'Inter-SemiBold',
  },
  saveText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});

export default CartScreen;