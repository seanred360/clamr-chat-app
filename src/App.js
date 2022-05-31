import SignInPage from "./components/SignInPage";
import SideBar from "./components/SideBar";
import ChannelBar from "./components/ChannelBar";
import ChatFeed from "./components/chatfeed/ChatFeed";
import { useAuthContext } from "./components/AuthContext";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  doc,
  getDoc,
  where,
  query,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./components/firebaseConfig";
import TopNavigation from "./components/TopNavigation";
import _ from "lodash";

function App() {
  const { user } = useAuthContext();
  return (
    <main className="flex items-center justify-center bg-gray-500 p-6 md:p-0">
      {user ? <HomePage user={user} /> : <SignInPage />}
    </main>
  );
}

function HomePage({ user }) {
  const [currentChannel, setCurrentChannel] = useState("friends");
  const [currentChatRoom, setCurrentChatRoom] = useState();
  const [friendsList, setFriendsList] = useState();
  const [currentUserData, setCurrentUserData] = useState();

  const handleCreateDMRoom = async (newChatMember, newRoomUid = "") => {
    const createDM = async () => {
      // create a new chat room in the chatRooms firstore collection
      const docRef = doc(db, "chatRooms", newRoomUid);
      const payload = {
        [user.uid]: true,
        [newChatMember]: true,
      };
      const result = await setDoc(docRef, payload);
      console.log("created a new DM chat room");
    };
    createDM();

    const updateUserChatRooms = async () => {
      // add new chatroom to the current user's chatroom list
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await (await getDoc(userDocRef)).data();
      await updateDoc(userDocRef, {
        chatRooms: { ...userDocSnap.chatRooms, [newRoomUid]: true },
      });
      console.log("updated user chatrooms");
    };
    updateUserChatRooms();
  };

  const handleClickFriend = (friendUid) => {
    const directMessageUid = user.uid + friendUid;
    if (_.has(currentUserData.chatRooms, directMessageUid)) {
      console.log("friend DM already exists");
      setCurrentChatRoom(directMessageUid);
      setCurrentChannel("chatroom");
    } else {
      console.log("friend DM not found, creating a new room");
      handleCreateDMRoom(friendUid, directMessageUid);
      setCurrentChatRoom(directMessageUid);
      setCurrentChannel("chatroom");
    }
  };

  // get realtime updates on the firestore data about the currently logged in user
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setCurrentUserData(doc.data());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await (await getDoc(docRef)).data();
      const friendsList = Object.keys(docSnap.friendsList);

      const q = query(
        collection(db, "users"),
        where("uid", "in", [...friendsList])
      );

      let fetchedFriendsList = [];

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        fetchedFriendsList = [...fetchedFriendsList, doc.data()];
      });
      setFriendsList(fetchedFriendsList);
    };
    getFriends();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <ChannelBar
        currentUserData={currentUserData}
        friends={friendsList}
        onClickFriend={handleClickFriend}
        onChangeChannel={(e) => setCurrentChannel("friends")}
      />
      {currentChannel == "friends" ? (
        <FriendsList
          friendsList={friendsList}
          onChangeChannel={handleClickFriend}
        />
      ) : (
        <ChatFeed chatRoomUid={currentChatRoom} />
      )}
    </div>
  );
}

const FriendsList = ({ friendsList, onChangeChannel }) => {
  if (!friendsList) return null;

  return (
    <div className="content-container">
      <TopNavigation />
      <ul className="content-list">
        <li className="mr-auto mb-3 text-gray-400 font-normal text-left">
          Online - {friendsList.length}
        </li>
        {friendsList.map((friend) => (
          <li key={friend.uid} className="friendListItem">
            <Friend
              displayName={friend.displayName}
              photoURL={friend.photoURL}
              onChangeChannel={() => onChangeChannel(friend.uid)}
              uid={friend.uid}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Friend = ({ displayName, photoURL, onChangeChannel }) => {
  return (
    <button className="friend" onClick={onChangeChannel}>
      <img className="rounded-full w-9" src={photoURL} alt="user avatar" />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="flex flex-col mr-auto">
        <span className="text-white font-bold my-auto mr-auto ml-3">
          {displayName}
        </span>
        <span className="text-gray-400 font-normal my-auto mr-auto ml-3">
          Online
        </span>
      </span>
    </button>
  );
};

export default App;
