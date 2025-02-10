import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import store from './src/redux/store';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RestaurantDetailsScreen from './src/screens/RestaurantDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import MenuItemDetails from './src/screens/MenuItemDetails';
import OrderScreen from './src/screens/OrderScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        const icons = { 
          Home: 'home', 
          Cart: 'cart', 
          Profile: 'person' 
        };
        return (
          <Ionicons 
            name={focused ? icons[route.name] : `${icons[route.name]}-outline`} 
            size={size} 
            color={color} 
          />
        );
      },
      tabBarActiveTintColor: '#6366F1',
      tabBarInactiveTintColor: '#94A3B8',
      tabBarLabelStyle: { 
        fontSize: 12,
        fontFamily: 'Inter-SemiBold',
      },
      tabBarStyle: { 
        backgroundColor: '#fff',
        height: 80,
        paddingTop: 10,
        borderTopWidth: 0,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const user = await AsyncStorage.getItem('user');
        setIsLoggedIn(!!(token && user));
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return null; // Add loading indicator here
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? 'MainTabs' : 'Login'}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegistrationScreen} />

      {/* Main App Screens */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
  name="RestaurantDetails" 
  component={RestaurantDetailsScreen} 
  options={{ headerShown: true }} 
/>

      <Stack.Screen name="ItemDetails" component={MenuItemDetails} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
    </Stack.Navigator>
  );
};

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}  edges={['left', 'right', 'bottom','top']}>
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  </Provider>
);

export default App;