import { configureStore } from "@reduxjs/toolkit";
import authSlice, { loginSuccess } from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import userDataReducer from "./slices/userDataSlice";
import thunk from "redux-thunk";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    userData: userDataReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

export default store;
