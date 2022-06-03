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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./components/firebaseConfig";
import TopNavigation from "./components/TopNavigation";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

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
  const [chatRooms, setChatRooms] = useState();
  const [currentUserData, setCurrentUserData] = useState();

  const handleCreateChatRoom = async () => {
    const newChatRoomUid = uuidv4();

    const createChatRoom = async () => {
      // create a new chat room in the chatRooms firstore collection
      const docRef = doc(db, "chatRooms", newChatRoomUid);
      const payload = {
        uid: newChatRoomUid,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        members: [user.uid],
        modifiedAt: serverTimestamp(),
        name: "Sean Red",
        recentMessage: {
          messageText: "",
          readBy: {},
          sentAt: serverTimestamp(),
          sentBy: "",
        },
      };
      const result = await setDoc(docRef, payload);
      console.log("created a new DM chat room");
    };
    createChatRoom();

    // TODO add popup window , user types friends name in

    // const updateUserChatRooms = async () => {
    //   // add new chatroom to the current user's chatroom list
    //   const userDocRef = doc(db, "users", user.uid);
    //   const userDocSnap = await (await getDoc(userDocRef)).data();
    //   await updateDoc(userDocRef, {
    //     chatRooms: { ...userDocSnap.chatRooms, [newChatRoomUid]: true },
    //   });
    //   console.log("updated current user chatrooms");

    //   const usersRef = collection(db, "users");
    //   const q = query(usersRef, where("uid", "in", [user.uid, newChatMember]));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    //     updateDoc(doc.ref, {
    //       chatRooms: { ...doc.data().chatRooms, [newChatRoomUid]: true },
    //     });
    //   });
    // };
    // updateUserChatRooms();
  };

  const handleEnterChatRoom = (chatRoomUid) => {
    setCurrentChatRoom(chatRoomUid);
    setCurrentChannel("chatroom");
    console.log("entered chat " + chatRoomUid);
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

    const getChatRooms = async () => {
      const chatRoomsRef = collection(db, "chatRooms");
      const q = query(
        chatRoomsRef,
        where("members", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(q);
      let newChatRooms = [];
      querySnapshot.forEach((doc) => {
        newChatRooms.push({ [doc.id]: doc.data() });
      });
      setChatRooms(newChatRooms);
    };
    getChatRooms();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <ChannelBar
        currentUserData={currentUserData}
        chatRooms={chatRooms}
        onClickChat={handleEnterChatRoom}
        onCreateChatRoom={handleCreateChatRoom}
      />
      {currentChannel == "friends" ? (
        <FriendsList
          friendsList={friendsList}
          onClickFriend={handleEnterChatRoom}
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
