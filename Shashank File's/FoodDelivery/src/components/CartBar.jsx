import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CartBar = ({ bottomOffset = 24 }) => {
  const cartItems = useSelector(state => state.cart.items);
  const navigation = useNavigation();

  if (Object.keys(cartItems).length === 0) return null;

  const totalItems = Object.values(cartItems).reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalAmount = Object.values(cartItems).reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.itemsText}>{totalItems} items</Text>
          <Text style={styles.amountText}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.buttonText}>Checkout</Text>
          <Icon name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: '#6366F1',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  itemsText: {
    color: '#E0E7FF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});

export default CartBar;