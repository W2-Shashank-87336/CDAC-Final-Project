// src/redux/userReducer.js

// Action Types
const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

// Action Creators
export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const getUser = (state) => state.user.user;

// Initial State
const initialState = {
  user: null,
};

// Reducer Function
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case CLEAR_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}
