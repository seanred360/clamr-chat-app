import { useState, useEffect } from "react";
import { BsHash } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoLogoIonitron } from "react-icons/io";

import { useAuthContext } from "./AuthContext";
import { auth, db } from "./firebaseConfig";
import { collection, where, query, getDocs } from "firebase/firestore";

const ChannelBar = ({
  currentUserData,
  chatRooms,
  onClickChat,
  onChangeChannel,
  onCreateChatRoom,
}) => {
  return (
    <div className="channel-bar shadow-lg p-2 text-white">
      <ChannelBlock channelName={"Home"} />

      <button
        className="w-full h-10 flex items-center justify-left p-3 
        bg-gray-600 rounded-md text-base text-center"
        onClick={onChangeChannel}
      >
        <span className="mr-3 text-xl">
          <FaUserFriends />
        </span>
        <span>Friends</span>
      </button>
      <button className="w-full h-10 flex items-center justify-left p-3 rounded-md text-base text-center text-gray-500">
        <span className="mr-3 text-xl">
          <IoLogoIonitron />
        </span>
        <span>Nitro</span>
      </button>
      <span className="w-full h-10 flex items-center justify-between p-3 rounded-md text-base text-center text-gray-500">
        DIRECT MESSAGES
        <button onClick={onCreateChatRoom}>+</button>
      </span>
      {chatRooms &&
        chatRooms.map((chatRoom, index) => (
          <ChatRoom
            key={Object.keys(chatRoom)}
            chatRoomData={Object.values(chatRoom)}
            currentUserData={currentUserData}
            onClickChat={onClickChat}
          />
        ))}
      <UserBlock />
    </div>
  );
};

const ChatRoom = ({ chatRoomData, currentUserData, onClickChat }) => {
  const [chatMembers, setChatMembers] = useState();

  const handleSetChatMembers = (chatMemberArray) => {
    // remove the current user from the members because we do not need to display their photo or name to themself
    if (chatMemberArray <= 1) return;
    const filteredMembers = chatMemberArray.filter(
      (member) => member.uid !== currentUserData.uid
    );
    setChatMembers(filteredMembers);
  };

  useEffect(() => {
    const getChatMembersData = async () => {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("uid", "in", [...chatRoomData[0].members])
      );
      const querySnapshot = await getDocs(q);
      let membersData = [];
      querySnapshot.forEach((doc) => {
        membersData = [...membersData, doc.data()];
      });
      handleSetChatMembers(membersData);
    };
    getChatMembersData();
  }, []);

  if (!chatMembers) return null;
  return (
    <button
      className="w-[250px] flex align-center justify-center m-t-[auto] p-2 
    text-gray-400 hover:bg-gray-600 rounded-md"
      onClick={() => onClickChat(chatRoomData[0].uid)}
    >
      <img
        className="rounded-full w-9"
        src={chatMembers[0].photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="text-white font-bold my-auto mr-auto ml-3">
        {chatMembers[0].displayName}
      </span>
    </button>
  );
};

const Dropdown = ({ header, selections }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="dropdown">
      <div onClick={() => setExpanded(!expanded)} className="dropdown-header">
        <ChevronIcon expanded={expanded} />
        <h5
          className={
            expanded ? "dropdown-header-text-selected" : "dropdown-header-text"
          }
        >
          {header}
        </h5>
        <FaPlus
          size="12"
          className="text-accent text-opacity-80 my-auto ml-auto"
        />
      </div>
      {expanded &&
        selections &&
        selections.map((selection) => (
          <TopicSelection key={selection} selection={selection} />
        ))}
    </div>
  );
};

const ChevronIcon = ({ expanded }) => {
  const chevClass = "text-accent text-opacity-80 my-auto mr-1";
  return expanded ? (
    <FaChevronDown size="14" className={chevClass} />
  ) : (
    <FaChevronRight size="14" className={chevClass} />
  );
};

const TopicSelection = ({ selection }) => (
  <div className="dropdown-selection">
    <BsHash size="24" className="text-gray-400" />
    <h5 className="dropdown-selection-text">{selection}</h5>
  </div>
);

const ChannelBlock = ({ channelName }) => (
  <div className="channel-block">
    <h5 className="channel-block-text">{channelName}</h5>
  </div>
);

const UserBlock = () => {
  const { logout } = useAuthContext();
  const { currentUser } = auth;
  return (
    <div className="fixed w-[250px] bottom-0 flex align-center justify-center m-t-[auto] p-2 bg-gray-900/50 text-gray-400">
      <img
        className="rounded-full w-9"
        src={currentUser.photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="text-white font-bold my-auto mr-auto">
        {currentUser.displayName}
      </span>
      <button onClick={logout}>
        <IoLogOutOutline className="text-4xl text-red-700" />
      </button>
    </div>
  );
};

export default ChannelBar;
