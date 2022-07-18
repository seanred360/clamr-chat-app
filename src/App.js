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
  addDoc,
} from "firebase/firestore";
import { db } from "./components/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "./components/store/slices/authSlice";

import TopNavigation from "./components/TopNavigation";
import SideBar from "./components/SideBar";
import ChannelBar from "./components/ChannelBar";
import ChatFeed from "./components/chatfeed/ChatFeed";
import Friends from "./components/channels/friends/Friends";
import LoginPage from "./components/LoginPage";
import { selectUserData } from "./components/store/slices/userDataSlice";
import { selectChannel } from "./components/store/slices/uiSlice";

function App() {
  const currentUser = useSelector(selectUser);

  return (
    <main className="flex items-center justify-center bg-gray-500 p-6 md:p-0">
      {currentUser != null ? <HomePage /> : <LoginPage />}
    </main>
  );
}

function HomePage() {
  const userData = useSelector(selectUserData);
  const channel = useSelector(selectChannel);

  const handleCreateChatRoom = async (chatMembers) => {
    const newChatRoomUid = uuidv4();

    const createChatRoom = async (chatMembers) => {
      // create a new chat room in the chatRooms firstore collection
      const memberUids = chatMembers.map((member) => member.uid);
      const memberNames = chatMembers.map((member) => member.displayName);

      const docRef = doc(db, "chatRooms", newChatRoomUid);
      const payload = {
        uid: newChatRoomUid,
        createdAt: serverTimestamp(),
        createdBy: userData.uid,
        members: memberUids,
        modifiedAt: serverTimestamp(),
        name: memberNames,
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
    createChatRoom(chatMembers);

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

  const handleSendFriendRequest = async (newFriend) => {
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
      const requestData = doc.data();
      if (requestData.discriminator === friendDiscriminator) {
        sendRequest(requestData.uid);
      }
    });

    async function sendRequest(friendUid) {
      // update each users requests list on the database
      const userRef = doc(db, "users", userData.uid);
      const friendRef = doc(db, "users", friendUid);
      const payloadForUser = {
        outgoingFriendRequests: arrayUnion(friendUid),
      };
      const payloadForFriend = {
        incomingFriendRequests: arrayUnion(userData.uid),
      };
      await updateDoc(userRef, payloadForUser);
      await updateDoc(friendRef, payloadForFriend);
    }
    return success;
  };

  return (
    <div className="flex w-full h-screen">
      <SideBar />
      <ChannelBar onCreateChatRoom={handleCreateChatRoom} />
      <div className="content-container">
        <TopNavigation onSendRequest={handleSendFriendRequest} />
        {channel == "friends" ? (
          <div className="content-container">
            <Friends
              onSendRequest={handleSendFriendRequest}
              onCreateChatRoom={handleCreateChatRoom}
              userData={userData}
            />
          </div>
        ) : (
          <ChatFeed />
        )}
      </div>
    </div>
  );
}

export default App;
