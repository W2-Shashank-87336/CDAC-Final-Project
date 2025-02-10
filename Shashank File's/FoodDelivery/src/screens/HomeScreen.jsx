import React, { useEffect, useState } from 'react';
import { View, Image, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import client from '../api/client';
import * as Location from 'expo-location';
import { BASE_URL } from '../api/baseURL';
import Icon from 'react-native-vector-icons/MaterialIcons';


const HomeScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Ensures high accuracy
        maximumAge: 0, // Avoids cached location
      });

      console.log("User Location:", location.coords);

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      fetchRestaurants(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  const fetchRestaurants = async (lat, lon) => {
    try {
      const response = await client.get('/restaurants');
      const updatedRestaurants = response.data.map((restaurant) => ({
        ...restaurant,
        distance: calculateDistance(lat, lon, restaurant.latitude, restaurant.longitude).toFixed(2),
      }));
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance in KM
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#C73559" style={styles.loader} />;
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Restaurants</Text>
        <TouchableOpacity >
          <Icon name="tune" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const fullImageUrl = item.image && typeof item.image === 'string' && item.image.startsWith('http')
            ? item.image
            : `${BASE_URL}${item.image}`;

          return (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('RestaurantDetails', { id: item.id, restaurantName: item.name })}
            >
              <Image 
                source={{ uri: fullImageUrl }} 
                style={styles.image} 
                resizeMode="cover"
              />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.metaContainer}>
                  <View style={styles.distanceBadge}>
                    <Icon name="location-on" size={14} color="#6366F1" />
                    <Text style={styles.distanceText}>{item.distance} km</Text>
                  </View>
                  
                  <View style={styles.addressContainer}>
                    <Icon name="place" size={14} color="#94A3B8" />
                    <Text style={styles.address} numberOfLines={1}>{item.addressLine1}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 12,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  listContent: {
    paddingBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;