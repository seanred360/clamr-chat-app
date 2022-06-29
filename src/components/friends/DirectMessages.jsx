import ChatRoom from "./ChatRoom";

const DirectMessages = ({ chatRoomData, onEnterChat, onCreateChatRoom }) => {
  if (!chatRoomData) return null;
  return (
    <div>
      
      {chatRoomData.map((chatRoom, index) => (
        <ChatRoom
          key={chatRoom.uid}
          chatRoomData={chatRoom}
          onEnterChat={onEnterChat}
        />
      ))}
    </div>
  );
};

export default DirectMessages;
