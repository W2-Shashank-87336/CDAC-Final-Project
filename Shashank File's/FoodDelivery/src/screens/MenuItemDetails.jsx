import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import client from '../api/client';

const MenuItemDetails = ({ route }) => {
  const { restaurantId, itemId, menuId } = route.params;

  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuItem();
  }, [route.params]);

  const getMenuItem = async () => {
    try {
      const response = await client.get(`menu/items/${restaurantId}/menus/${menuId}/items/${itemId}`);
      setMenuItem(response.data);
    } catch (error) {
      console.error('Error fetching menu item details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#C73559" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Menu Item Details</Text>
      {menuItem ? (
        <View>
          <Text style={styles.itemName}>{menuItem.name}</Text>
          <Text style={styles.itemDescription}>{menuItem.description}</Text>
          <Text style={styles.itemPrice}>Price: ${menuItem.price}</Text>
        </View>
      ) : (
        <Text>Menu item not found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDescription: { fontSize: 16, color: '#606060', marginVertical: 5 },
  itemPrice: { fontSize: 16, color: '#C73559', fontWeight: 'bold' },
});

export default MenuItemDetails;
