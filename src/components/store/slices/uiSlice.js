import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    server: "@me",
    channel: "friends",
    subChannel: "",
  },
  reducers: {
    setServer: (ui, action) => {
      ui.server = action.payload;
    },
    setChannel: (ui, action) => {
      ui.channel = action.payload;
    },
    setSubChannel: (ui, action) => {
      ui.subChannel = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setServer, setChannel, setSubChannel } = uiSlice.actions;

export const selectChannel = (state) => state.ui.channel;
export const selectSubChannel = (state) => state.ui.subChannel;

export default uiSlice.reducer;
