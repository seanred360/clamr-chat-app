import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, Logout } from "./firebaseConfig";
import { IoLogOutOutline } from "react-icons/io5";
import { IoLogoIonitron } from "react-icons/io";

import { selectChannel, setChannel } from "./store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "./store/slices/authSlice";
import ChatRoom from "./channels/ChatRoom";
import {
  selectFriendChatData,
  selectGroupChatData,
} from "./store/slices/userDataSlice";

const ChannelBar = ({ onCreateChatRoom }) => {
  const dispatch = useDispatch();
  const channel = useSelector(selectChannel);
  const groupChatData = useSelector(selectGroupChatData);
  const friendChatData = useSelector(selectFriendChatData);
  const [chatRoomData, setChatRoomData] = useState();

  useEffect(() => {
    if (friendChatData != null) setChatRoomData([...friendChatData]);
    if (groupChatData != null) setChatRoomData([...groupChatData]);
  }, [groupChatData, friendChatData]);

  return (
    <div className="channel-bar shadow-lg p-2 text-white">
      <TitleBlock channelName={"Home"} />
      <FriendsListButton
        isSelected={channel == "friends"}
        handleClick={dispatch}
      />
      <NitroButton isSelected={channel == "nitro"} />
      <DirectMessagesTitle onCreateChatRoom={onCreateChatRoom} />
      <DirectMessages
        chatRoomData={chatRoomData}
        onCreateChatRoom={onCreateChatRoom}
      />
      <UserBlock />
    </div>
  );
};

const TitleBlock = ({ channelName }) => (
  <div className="channel-block">
    <h5 className="channel-block-text">{channelName}</h5>
  </div>
);

const FriendsListButton = ({ isSelected, handleClick }) => {
  const currentUser = useSelector(selectUser);
  const [pendingCount, setPendingCount] = useState();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
      setPendingCount(doc.data().incomingFriendRequests.length);
    });
    return unsub;
  }, [currentUser]);

  return (
    <button
      className={`channelButton ${isSelected && "selected"}`}
      onClick={() => handleClick(setChannel("friends"))}
    >
      <span className="mr-3 text-xl">
        <svg
          x="0"
          y="0"
          className="icon-2xnN2Y"
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g fill="none" fillRule="evenodd">
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
              transform="translate(2 4)"
            ></path>
            <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
          </g>
        </svg>
      </span>
      <span>Friends</span>
      {pendingCount > 0 && (
        <span className="min-w-[16px] min-h-[16px] ml-auto rounded-full bg-red-500 text-xs">
          {pendingCount}
        </span>
      )}
    </button>
  );
};

const NitroButton = ({ isSelected }) => (
  <button className={`channelButton ${isSelected && "selected"}`}>
    <span className="mr-3 text-xl">
      <IoLogoIonitron />
    </span>
    <span>Coming soon</span>
  </button>
);

const DirectMessagesTitle = ({ onCreateChatRoom }) => (
  <span
    className="w-full h-10 flex items-center justify-between p-3 rounded-md 
  text-center text-zinc-400 font-medium tracking-wider text-xs uppercase hover:text-white"
  >
    Direct Messages
    <button className="text-2xl" onClick={onCreateChatRoom}>
      +
    </button>
  </span>
);

const DirectMessages = ({ chatRoomData }) => {
  if (!chatRoomData) return null;
  return (
    <div>
      {chatRoomData.map((chatRoom) => (
        <ChatRoom key={chatRoom.uid} chatRoomData={chatRoom} />
      ))}
    </div>
  );
};

const UserBlock = () => {
  const currentUser = useSelector(selectUser);

  return (
    <div className="flex align-center justify-center mt-[auto] p-2 bg-gray-900/50 text-gray-400">
      <img
        className="rounded-full w-9"
        src={currentUser.photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="text-white font-bold my-auto mr-auto ellipsis">
        {currentUser.displayName}
      </span>
      <button onClick={Logout}>
        <IoLogOutOutline className="text-4xl text-red-700" />
      </button>
    </div>
  );
};

export default ChannelBar;
