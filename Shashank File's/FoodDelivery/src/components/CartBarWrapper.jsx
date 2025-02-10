// src/components/CartBarWrapper.js
import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import CartBar from './CartBar';

// Helper function to get the active route name (recursively, if nested)
const getActiveRouteName = (state) => {
  if (!state || !state.routes) return null;
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

const CartBarWrapper = () => {
  const routeName = useNavigationState(state => getActiveRouteName(state));

  // Hide the CartBar if the active route is "Cart"
  if (routeName === 'Cart' || routeName === 'Login' || routeName === 'Register') return null;

  // Define the names of your tab screens.
  const tabScreens = ['Home', 'Profile', 'Cart'];
  // If the active route is a tab screen, use a bottom offset (e.g., 80),
  // otherwise, if it's a detail screen (no tab), use 0.
  const bottomOffset = tabScreens.includes(routeName) ? 100 : 20;

  return <CartBar bottomOffset={bottomOffset} />;
};

export default CartBarWrapper;
