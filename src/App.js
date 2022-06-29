import SignInPage from "./components/SignInPage";
import SideBar from "./components/SideBar";
import ChannelBar from "./components/ChannelBar";
import ChatFeed from "./components/chatfeed/ChatFeed";
import { useAuthContext } from "./components/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  collection,
  setDoc,
  doc,
  where,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./components/firebaseConfig";
import TopNavigation from "./components/TopNavigation";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import ChatRooms from "./components/friends/DirectMessages";
import { useSelector, useDispatch } from "react-redux";
import { changeSubChannel } from "./components/store/slices/channelSlice";

function App() {
  const { user } = useAuthContext();
  return (
    <main className="flex items-center justify-center bg-gray-500 p-6 md:p-0">
      {user ? <HomePage user={user} /> : <SignInPage />}
    </main>
  );
}

function HomePage({ user }) {
  const [currentChatRoom, setCurrentChatRoom] = useState();
  // const [friendsList, setFriendsList] = useState();
  const [chatRooms, setChatRooms] = useState();
  const subChannel = useSelector((state) => state.channel.subChannel);
  const dispatch = useDispatch();

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
        isGroup: false,
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

  const handleEnterChat = (chatRoomUid, chatRoomName) => {
    setCurrentChatRoom(chatRoomUid);
    dispatch(changeSubChannel(chatRoomName));
  };

  useEffect(() => {
    // const getFriends = async () => {
    //   const docRef = doc(db, "users", user.uid);
    //   const docSnap = await (await getDoc(docRef)).data();
    //   const friendsList = Object.keys(docSnap.friendsList);

    //   const q = query(
    //     collection(db, "users"),
    //     where("uid", "in", [...friendsList])
    //   );

    //   let fetchedFriendsList = [];

    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     fetchedFriendsList = [...fetchedFriendsList, doc.data()];
    //   });
    //   setFriendsList(fetchedFriendsList);
    // };
    // getFriends();

    const getChatRooms = async () => {
      const chatRoomsRef = collection(db, "chatRooms");
      const q = query(
        chatRoomsRef,
        where("members", "array-contains", user.uid)
      );
      const querySnapshot = await getDocs(q);
      let newChatRooms = [];
      querySnapshot.forEach((doc) => {
        newChatRooms.push(doc.data());
      });
      setChatRooms(newChatRooms);
    };
    getChatRooms();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <ChannelBar
        user={user}
        chatRoomData={chatRooms}
        onEnterChat={handleEnterChat}
        onCreateChatRoom={handleCreateChatRoom}
      />
      {subChannel == "friends" ? (
        <div className="content-container">
          <TopNavigation />
          <ChatRooms chatRoomData={chatRooms} onEnterChat={handleEnterChat} />
        </div>
      ) : (
        <ChatFeed chatRoomUid={currentChatRoom} />
      )}
    </div>
  );
}

export default App;
