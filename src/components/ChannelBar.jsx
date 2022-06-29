// import { useState } from "react";
// import { BsHash } from "react-icons/bs";
// import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoLogoIonitron } from "react-icons/io";

import { useAuthContext } from "./contexts/AuthContext";
import DirectMessages from "./friends/DirectMessages";
import { changeSubChannel } from "./store/slices/channelSlice";
import { useDispatch, useSelector } from "react-redux";

const ChannelBar = ({ chatRoomData, onEnterChat, onCreateChatRoom }) => {
  const dispatch = useDispatch();
  const subChannel = useSelector((state) => state.channel.subChannel);

  return (
    <div className="channel-bar shadow-lg p-2 text-white">
      <TitleBlock channelName={"Home"} />
      <FriendsListButton
        isSelected={subChannel == "friends"}
        onChangeSubChannel={dispatch}
      />
      <NitroButton
        isSelected={subChannel == "nitro"}
        onChangeSubChannel={dispatch}
      />
      <DirectMessagesTitle onCreateChatRoom={onCreateChatRoom} />
      <DirectMessages
        chatRoomData={chatRoomData}
        onEnterChat={onEnterChat}
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

const FriendsListButton = ({ isSelected, onChangeSubChannel }) => (
  <button
    className={`subChannelButton ${isSelected && "selected"}`}
    onClick={() => onChangeSubChannel(changeSubChannel("friends"))}
  >
    <span className="mr-3 text-xl">
      <FaUserFriends />
    </span>
    <span>Friends</span>
  </button>
);

const NitroButton = ({ isSelected, onChangeSubChannel }) => (
  <button className={`subChannelButton ${isSelected && "selected"}`}>
    <span className="mr-3 text-xl">
      <IoLogoIonitron />
    </span>
    <span>Nitro</span>
  </button>
);

const DirectMessagesTitle = ({ onCreateChatRoom }) => (
  <span
    className="w-full h-10 flex items-center justify-between p-3 rounded-md 
  text-center text-zinc-400 font-medium tracking-wider text-xs uppercase hover:text-white"
  >
    Direct Messages
    <button className="text-2xl" onClick={onCreateChatRoom}>+</button>
  </span>
);

const UserBlock = () => {
  const { logout } = useAuthContext();
  const { user } = useAuthContext();

  return (
    <div className="fixed w-[250px] bottom-0 flex align-center justify-center m-t-[auto] p-2 bg-gray-900/50 text-gray-400">
      <img className="rounded-full w-9" src={user.photoURL} alt="user avatar" />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="text-white font-bold my-auto mr-auto ellipsis">
        {user.displayName}
      </span>
      <button onClick={logout}>
        <IoLogOutOutline className="text-4xl text-red-700" />
      </button>
    </div>
  );
};

// const Dropdown = ({ header, selections }) => {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className="dropdown">
//       <div onClick={() => setExpanded(!expanded)} className="dropdown-header">
//         <ChevronIcon expanded={expanded} />
//         <h5
//           className={
//             expanded ? "dropdown-header-text-selected" : "dropdown-header-text"
//           }
//         >
//           {header}
//         </h5>
//         <FaPlus
//           size="12"
//           className="text-accent text-opacity-80 my-auto ml-auto"
//         />
//       </div>
//       {expanded &&
//         selections &&
//         selections.map((selection) => (
//           <TopicSelection key={selection} selection={selection} />
//         ))}
//     </div>
//   );
// };

// const ChevronIcon = ({ expanded }) => {
//   const chevClass = "text-accent text-opacity-80 my-auto mr-1";
//   return expanded ? (
//     <FaChevronDown size="14" className={chevClass} />
//   ) : (
//     <FaChevronRight size="14" className={chevClass} />
//   );
// };

// const TopicSelection = ({ selection }) => (
//   <div className="dropdown-selection">
//     <BsHash size="24" className="text-gray-400" />
//     <h5 className="dropdown-selection-text">{selection}</h5>
//   </div>
// );

export default ChannelBar;
