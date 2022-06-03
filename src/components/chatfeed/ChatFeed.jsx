import TopNavigation from "../TopNavigation";
import BottomBar from "./BottomBar";
import ChatMessage from "./ChatMessage";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { onSnapshot, collection, doc } from "firebase/firestore";

const ChatFeed = ({ chatRoomUid }) => {
  const [messages, setMessages] = useState([
    { name: "Loading...", id: "initial" },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "chats", chatRoomUid, "messages"),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse()
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, [chatRoomUid]);

  return (
    <div className="content-container">
      <TopNavigation />
      <div className="content-list z-10">
        {/* TODO order messages by date */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            chatRoomUid={chatRoomUid}
            messageUid={message.id}
            displayName={message.displayName}
            photoURL={message.photoURL}
            time={message.time}
            content={message.content}
          />
        ))}
      </div>
      <BottomBar chatRoomUid={chatRoomUid} />
    </div>
  );
};

export default ChatFeed;
