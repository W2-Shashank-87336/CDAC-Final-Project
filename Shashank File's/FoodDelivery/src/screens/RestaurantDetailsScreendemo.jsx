import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';

const RestaurantDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const navigation = useNavigation();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await client.get(`/menus/${id}/menus`);
      console.log("Menu", response.data);
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching restaurant menu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#C73559" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant Menu</Text>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
  style={styles.item}
  onPress={() => navigation.navigate('Menu', { restaurantId: id, menuId: item.id })}
>
  <Text>{item.menuName}</Text>

</TouchableOpacity>

        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  heading: { fontSize: 20, color: '#333333', fontWeight: 'bold', marginTop: 30 },
  item: { padding: 16, backgroundColor: '#f9f9f9', marginVertical: 8, borderRadius: 8 },
});

export default RestaurantDetailsScreen;
