import { createSlice } from "@reduxjs/toolkit";

// Get initial user state from localStorage
const initialUser = JSON.parse(localStorage.getItem("user")) || null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: initialUser,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
