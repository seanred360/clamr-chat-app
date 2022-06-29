import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "./slices/channelSlice";

export const store = configureStore({
  reducer: {
    channel: channelReducer,
  },
});

export default store;
