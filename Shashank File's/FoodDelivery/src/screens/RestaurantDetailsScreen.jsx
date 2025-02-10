import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import { addToCart, decreaseQuantity } from '../redux/cartReducer';
import { BASE_URL } from '../api/baseURL';

  
  const RestaurantDetailsScreen = ({ route, navigation }) => {
    const { id, restaurantName } = route.params; // Restaurant ID

    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    navigation.setOptions({ title: restaurantName });
    const [categories, setCategories] = useState([]); // Restaurant menu categories
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingItems, setLoadingItems] = useState(false);
  
    useEffect(() => {
      fetchMenuCategories();
    }, []);
  
    // Fetch the restaurant's menu categories
    const fetchMenuCategories = async () => {
      try {
        const response = await client.get(`/menus/${id}/menus`);
        setCategories(response.data);
        if (response.data && response.data.length > 0) {
          // Auto-select the first category
          setSelectedCategory(response.data[0]);
          fetchMenuItems(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching restaurant menu categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
  
    // Fetch menu items for the given menu (category)
    const fetchMenuItems = async (menuId) => {
      setLoadingItems(true);
      try {
        const response = await client.get(`menu/items/${id}/menus/${menuId}/items`);
        console.log(response.data);
        setMenuItems(response.data);
  
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoadingItems(false);
      }
    };
  
    // Handle when a user taps a category
    const handleCategoryPress = (category) => {
      setSelectedCategory(category); 
      fetchMenuItems(category.id);
    };
  
    if (loadingCategories) {
      return <ActivityIndicator size="large" color="#C73559" style={styles.loader} />;
    }
  
    return (
      <View style={styles.container}>
        <FlatList
          data={categories}
          style={styles.categories}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const fullImageUrl = item.image && typeof item.image === 'string' && item.image.startsWith('http')
            ? item.image
            : `${BASE_URL}${item.image}`;
            
            return(
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory?.id === item.id && styles.selectedCategory
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <Image 
                source={{ uri: fullImageUrl }} 
                style={styles.categoryImage} 
                resizeMode="cover"
              />
              <Text style={styles.categoryText}>{item.menuName}</Text>
              {selectedCategory?.id === item.id && (
                <View style={styles.categoryIndicator} />
              )}
            </TouchableOpacity>
          )}}
        />
  
        {loadingItems ? (
          <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
        ) : (
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.menuContainer}
            renderItem={({ item }) => {
              const fullImageUrl = item.image && typeof item.image === 'string' && item.image.startsWith('http')
                        ? item.image
                        : `${BASE_URL}${item.image}`;
              return (
              <View style={styles.menuItem}>
                <Image 
                  source={{ uri: fullImageUrl }} 
                  style={styles.menuImage} 
                  resizeMode="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.menuItemName}>{item.itemName}</Text>
                  {item.description && (
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  )}
                  <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                </View>
                
                {cart.items[item.id] ? (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => dispatch(decreaseQuantity(item.id))}
                    >
                      <Icon name="remove" size={20} color="#6366F1" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{cart.items[item.id].quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton} 
                      onPress={() => dispatch(addToCart(item, id))}
                    >
                      <Icon name="add" size={20} color="#6366F1" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => dispatch(addToCart(item, id))}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}}
          />
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F9',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryList: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
    },
    categoryItem: {
      width: 120,
      marginRight: 16,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryImage: {
      width: '100%',
      height: 80,
      backgroundColor: '#F3F4F6',
    },
    categoryText: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
      color: '#1F2937',
      padding: 12,
      textAlign: 'center',
    },
    selectedCategory: {
      borderWidth: 2,
      borderColor: '#6366F1',
    },
    categoryIndicator: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: '#6366F1',
    },
    menuContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    menuItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    menuImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
    },
    itemInfo: {
      flex: 1,
    },
    menuItemName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#1F2937',
      marginBottom: 4,
    },
    menuItemDescription: {
      fontSize: 13,
      fontFamily: 'Inter-Regular',
      color: '#64748B',
      marginBottom: 8,
      lineHeight: 18,
    },
    menuItemPrice: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#6366F1',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EEF2FF',
      borderRadius: 8,
      padding: 6,
      gap: 8,
    },
    quantityButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      padding: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    quantityText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#1F2937',
      minWidth: 20,
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: '#EEF2FF',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    addButtonText: {
      color: '#6366F1',
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
    },
  });
  
  export default RestaurantDetailsScreen;