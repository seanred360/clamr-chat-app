import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    chatRoomIDs: {},
    // groupChatData: {},
    // friendChatData: {},
    discriminator: "",
    displayName: "",
    email: "",
    friendsList: "",
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    photoURL: "",
    uid: "",
    loading: false,
    error: false,
  },
  reducers: {
    setUserData: (userData, action) => {
      userData.chatRoomIDs = action.payload.chatRoomIDs;
      userData.discriminator = action.payload.discriminator;
      userData.displayName = action.payload.displayName;
      userData.email = action.payload.email;
      userData.friendsList = action.payload.friendsList;
      userData.incomingFriendRequests = action.payload.incomingFriendRequests;
      userData.outgoingFriendRequests = action.payload.outgoingFriendRequests;
      userData.photoURL = action.payload.photoURL;
      userData.uid = action.payload.uid;
      userData.loading = false;
    },
    setGroupChatData: (userData, action) => {
      userData.groupChatData = action.payload;
    },
    setFriendChatData: (userData, action) => {
      userData.friendChatData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, setGroupChatData, setFriendChatData } =
  userDataSlice.actions;

export const selectUserData = (state) => state.userData;
export const selectGroupChatData = (state) => state.userData.groupChatData;
export const selectFriendChatData = (state) => state.userData.friendChatData;

export default userDataSlice.reducer;
