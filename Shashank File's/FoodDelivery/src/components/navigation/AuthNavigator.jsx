import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import RestaurantDetailsScreen from '../../screens/RestaurantDetailsScreen';
import RegisterScreen from '../../screens/RegistrationScreen';
import LoginScreen from '../../screens/LoginScreen';
import MenuScreen from '../../screens/MenuScreen';
import MenuItemDetails from '../../screens/MenuItemDetails';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="itemDetails" component={MenuItemDetails} />
  </Stack.Navigator>
);

export default AuthNavigator;
