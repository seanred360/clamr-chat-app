import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (auth) => {
      auth.loading = true;
      auth.error = null;
    },
    loginSuccess: (auth, action) => {
      auth.loading = false;
      auth.user = action.payload;
    },
    loginFailure: (auth) => {
      auth.loading = false;
      auth.error = "login failed";
    },
    logout: (auth) => {
      auth.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { logout, loginRequest, loginSuccess, loginFailure } =
  authSlice.actions;

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
