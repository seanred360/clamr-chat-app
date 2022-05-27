import TopNavigation from "../TopNavigation";
import BottomBar from "./BottomBar";
import Post from "./Post";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { onSnapshot, collection } from "firebase/firestore";

const ChatFeed = () => {
  const [messages, setMessages] = useState([
    { name: "Loading...", id: "initial" },
  ]);

  useEffect(
    () =>
      onSnapshot(collection(db, "messages"), (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse()
        )
      ),
    []
  );

  return (
    <div className="content-container">
      <TopNavigation />
      <div className="content-list z-10">
        {/* TODO order messages by date */}
        {messages.map((message) => (
          <Post
            key={message.id}
            id={message.id}
            displayName={message.displayName}
            photoURL={message.photoURL}
            time={message.time}
            content={message.content}
          />
        ))}
      </div>
      <BottomBar />
    </div>
  );
};

export default ChatFeed;
