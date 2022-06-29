import { createSlice } from "@reduxjs/toolkit";

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    currentChannel: "@me",
    subChannel: "friends",
  },
  reducers: {
    changeChannel: (channel, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      channel.currentChannel = action.payload;
    },
    changeSubChannel: (channel, action) => {
      channel.subChannel = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeChannel, changeSubChannel } = channelSlice.actions;

export default channelSlice.reducer;
