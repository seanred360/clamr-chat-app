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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./components/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setChannel } from "./components/store/slices/uiSlice";
import TopNavigation from "./components/TopNavigation";
import SignInPage from "./components/SignInPage";
import SideBar from "./components/SideBar";
import ChannelBar from "./components/ChannelBar";
import ChatFeed from "./components/chatfeed/ChatFeed";
import Friends from "./components/channels/friends/Friends";

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
  const [chatRooms, setChatRooms] = useState();
  const channel = useSelector((state) => state.ui.channel);
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
    dispatch(setChannel(chatRoomName));
  };

  const handleAddFriend = async (newFriend) => {
    const splitFriend = newFriend.trim().split("#");
    const friendName = splitFriend[0];
    const friendDiscriminator = `#${splitFriend[1]}`;
    const success = {
      error: false,
      message: `Success! Your friend request to ${newFriend} was sent`,
    };
    const error = {
      error: true,
      message:
        "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct.",
    };

    const nameQuery = query(
      collection(db, "users"),
      where("displayName", "==", friendName)
    );

    const querySnapshot = await getDocs(nameQuery);
    if (querySnapshot.empty) {
      return error;
    }
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.discriminator === friendDiscriminator) {
        addFriend(data.uid);
      }
    });

    async function addFriend(friendUid) {
      const userRef = doc(db, "users", user.uid);
      const friendRef = doc(db, "users", friendUid);
      const outgoingPayload = {
        outgoingFriendRequests: arrayUnion(friendUid),
      };
      const incomingPayload = {
        incomingFriendRequests: arrayUnion(user.uid),
      };
      await updateDoc(userRef, outgoingPayload);
      await updateDoc(friendRef, incomingPayload);
    }
    return success;
  };

  useEffect(() => {
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
      <div className="content-container">
        <TopNavigation onAddFriend={handleAddFriend} />
        {channel == "friends" ? (
          <div className="content-container">
            <Friends
              chatRoomData={chatRooms}
              onEnterChat={handleEnterChat}
              onAddFriend={handleAddFriend}
              user={user}
            />
          </div>
        ) : (
          <ChatFeed chatRoomUid={currentChatRoom} />
        )}
      </div>
    </div>
  );
}

export default App;
