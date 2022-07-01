import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ChatRoom from "../ChatRoom";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";

const Friends = ({ chatRoomData, onEnterChat, onAddFriend }) => {
  const subChannel = useSelector((state) => state.ui.subChannel);

  return subChannel === "add friend" ? (
    <AddFriend onAddFriend={onAddFriend} />
  ) : (
    <FriendsList chatRoomData={chatRoomData} onEnterChat={onEnterChat} />
  );
};

const SortFriends = () => {
  const [isTyping, setIsTyping] = useState(false);
  const searchRef = useRef();
  const handleClick = (e) => {
    e.preventDefault();
    searchRef.current.value = "";
    setIsTyping(false);
  };

  return (
    <div className="container p-6 flex flex-col">
      <span className="uppercase text-white font-bold">add friend</span>
      <span className="text-sm text-zinc-400 my-3">
        You can add a friend with their Clamr Tag. It's cAsE sEnSitIvE!
      </span>
      <form className="relative flex w-full h-12">
        <input
          className="w-full bg-gray-900 p-2 rounded text-white 
            placeholder:text-zinc-400 focus:outline-sky-600"
          type="text"
          placeholder="Enter a Username#0000"
          onChange={(e) => setIsTyping(e.target.value != "")}
          ref={searchRef}
        />
        <button
          className="absolute right-2 h-full text-white text-2xl"
          onClick={(e) => handleClick(e)}
        >
          {isTyping ? <AiOutlineClose /> : <AiOutlineSearch />}
        </button>
      </form>
    </div>
  );
};

const AddFriend = ({ onAddFriend }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState({ error: false, message: "" });
  const searchRef = useRef();

  const handleClick = async (e) => {
    e.preventDefault();
    const result = await onAddFriend(searchRef.current.value);
    setStatus(result);
    setHasSubmitted(true);
    searchRef.current.value = "";
    setIsTyping(false);
  };

  return (
    <div className="container p-6 flex flex-col border-b-[1px] border-zinc-600">
      <span className="uppercase text-white font-bold">add friend</span>
      <span className="text-sm text-zinc-400 my-3">
        You can add a friend with their Clamr Tag. It's cAsE sEnSitIvE!
      </span>
      <form
        className={
          hasSubmitted
            ? `flex w-full h-14 px-4 py-2 bg-gray-900 rounded-lg ${
                status.error == true
                  ? "border-red-500 border-2"
                  : "border-green-500 border-2"
              }`
            : "flex w-full h-14 px-4 py-2 bg-gray-900 rounded-lg"
        }
      >
        <input
          className="w-full bg-gray-900 text-white outline-0 
          placeholder:text-zinc-400"
          type="text"
          placeholder="Enter a Username#0000"
          onChange={(e) => setIsTyping(e.target.value != "")}
          ref={searchRef}
        />
        <button
          className="h-full px-4 text-white bg-indigo-500 rounded text-sm whitespace-nowrap disabled:opacity-75"
          onClick={(e) => handleClick(e)}
          disabled={!isTyping}
        >
          Send Friend Request
        </button>
      </form>
      {hasSubmitted && (
        <span
          className={`mt-3 text-sm ${
            status.error == true ? "text-red-400" : "text-green-400"
          }`}
        >
          {status.message}
        </span>
      )}
    </div>
  );
};

const FriendsList = ({ chatRoomData, onEnterChat }) => {
  const [friendChats, setFriendChats] = useState();

  useEffect(() => {
    if (!chatRoomData) return;
    let result = [];
    chatRoomData.forEach((chatRoom) => {
      if (chatRoom.isGroup === false) result.push(chatRoom);
    });
    return setFriendChats(result);
  }, [chatRoomData]);

  if (!friendChats) return null;
  return (
    <div>
      <h1>ALL FRIENDS - 10</h1>
      {friendChats.map((chatRoom) => (
        <ChatRoom
          key={chatRoom.uid}
          chatRoomData={chatRoom}
          onEnterChat={onEnterChat}
        />
      ))}
    </div>
  );
};

export default Friends;
