import { useState, useEffect } from "react";
import ChatRoom from "./ChatRoom";

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
      {friendChats.map((chatRoom, index) => (
        <ChatRoom
          key={chatRoom.uid}
          chatRoomData={chatRoom}
          onEnterChat={onEnterChat}
        />
      ))}
    </div>
  );
};

export default FriendsList;
