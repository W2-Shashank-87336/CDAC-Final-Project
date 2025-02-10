const ADD_TO_CART = 'ADD_TO_CART';
const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
const CLEAR_CART = 'CLEAR_CART'; // Added missing action type

export const addToCart = (item, restaurantId) => ({
  type: ADD_TO_CART,
  payload: { item, restaurantId },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const decreaseQuantity = (itemId) => ({
  type: DECREASE_QUANTITY,
  payload: itemId,
});

const initialState = {
  items: {}, // { [itemId]: { ...item, quantity } }
  restaurantId: null, // Stores the restaurant ID
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { item, restaurantId } = action.payload;

      // If the cart is not empty and a different restaurant's item is added, reset cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          items: { [item.id]: { ...item, quantity: 1 } },
          restaurantId,
        };
      }

      const items = { ...state.items };
      if (items[item.id]) {
        items[item.id].quantity += 1;
      } else {
        items[item.id] = { ...item, quantity: 1 };
      }

      return { ...state, items, restaurantId };
    }

    case DECREASE_QUANTITY: {
      const itemId = action.payload;
      const items = { ...state.items };

      if (items[itemId]) {
        if (items[itemId].quantity > 1) {
          items[itemId].quantity -= 1;
        } else {
          delete items[itemId];
        }
      }

      // If cart is empty after removal, reset restaurantId
      const isCartEmpty = Object.keys(items).length === 0;

      return { ...state, items, restaurantId: isCartEmpty ? null : state.restaurantId };
    }

    case CLEAR_CART: {
      return { ...initialState }; // Reset the state to initial
    }

    default:
      return state;
  }
}
