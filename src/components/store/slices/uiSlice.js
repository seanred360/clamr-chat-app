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
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      ui.channel = action.payload;
    },
    setSubChannel: (ui, action) => {
      ui.subChannel = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setServer, setChannel, setSubChannel } = uiSlice.actions;

export default uiSlice.reducer;
