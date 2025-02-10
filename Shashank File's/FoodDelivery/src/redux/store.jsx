// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import userReducer from './userReducer';
import cartReducer from './cartReducer'; // if you have one


// Combine reducers (if you have more than one)
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,

});

// Create the store
const store = createStore(rootReducer);

export default store;
