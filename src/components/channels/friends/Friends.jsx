import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ChatRoom from "../ChatRoom";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineCheck,
} from "react-icons/ai";
import { useRef } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const Friends = ({ chatRoomData, onEnterChat, onAddFriend }) => {
  const subChannel = useSelector((state) => state.ui.subChannel);

  if (subChannel === "add friend")
    return <AddFriend onAddFriend={onAddFriend} />;
  if (subChannel === "pending") return <FriendRequestsList />;
  return <FriendsList chatRoomData={chatRoomData} onEnterChat={onEnterChat} />;
};

// const SortFriends = () => {
//   const [isTyping, setIsTyping] = useState(false);
//   const searchRef = useRef();
//   const handleClick = (e) => {
//     e.preventDefault();
//     searchRef.current.value = "";
//     setIsTyping(false);
//   };

//   return (
//     <div className="container p-6 flex flex-col">
//       <span className="uppercase text-white font-bold">add friend</span>
//       <span className="text-sm text-zinc-400 my-3">
//         You can add a friend with their Clamr Tag. It's cAsE sEnSitIvE!
//       </span>
//       <form className="relative flex w-full h-12">
//         <input
//           className="w-full bg-gray-900 p-2 rounded text-white
//             placeholder:text-zinc-400 focus:outline-sky-600"
//           type="text"
//           placeholder="Enter a Username#0000"
//           onChange={(e) => setIsTyping(e.target.value != "")}
//           ref={searchRef}
//         />
//         <button
//           className="absolute right-2 h-full text-white text-2xl"
//           onClick={(e) => handleClick(e)}
//         >
//           {isTyping ? <AiOutlineClose /> : <AiOutlineSearch />}
//         </button>
//       </form>
//     </div>
//   );
// };

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

const FriendRequestsList = () => {
  const { user } = useAuthContext();
  const [incomingFriendRequests, setIncomingFriendRequests] = useState();
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState();

  useEffect(() => {
    const getFriendRequests = async (type, stateSetter) => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await (await getDoc(docRef)).data();
      const pendingRequests = docSnap[type];

      if (pendingRequests && pendingRequests.length > 0) {
        const q = query(
          collection(db, "users"),
          where("uid", "in", [...pendingRequests])
        );

        let fetchedFriendRequests = [];

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          fetchedFriendRequests = [...fetchedFriendRequests, doc.data()];
        });
        stateSetter(fetchedFriendRequests);
      }
    };
    getFriendRequests("incomingFriendRequests", setIncomingFriendRequests);
    getFriendRequests("outgoingFriendRequests", setOutgoingFriendRequests);
  }, [user]);

  const getPendingCount = () => {
    let count = 0;
    if (incomingFriendRequests) count += incomingFriendRequests.length;
    if (outgoingFriendRequests) count += outgoingFriendRequests.length;
    return count;
  };

  if (!incomingFriendRequests && !outgoingFriendRequests)
    return <h1>no requests</h1>;

  return (
    <div className="flex flex-col items-start justify-center p-6">
      <h1 className="w-full py-3 text-zinc-300 uppercase border-b-[1px] border-zinc-600">
        pending - {getPendingCount()}
      </h1>
      {incomingFriendRequests &&
        incomingFriendRequests.map((request) => (
          <FriendRequest
            key={`pending request ${request.uid}`}
            user={request}
            type={"incoming"}
          />
        ))}
      {outgoingFriendRequests &&
        outgoingFriendRequests.map((request) => (
          <FriendRequest
            key={`pending request ${request.uid}`}
            user={request}
            type={"outgoing"}
          />
        ))}
    </div>
  );
};

const FriendRequest = ({ user, type }) => {
  return (
    <div className="flex w-full items-center p-3 border-b-[1px] border-zinc-600 hover:bg-zinc-600 hover:rounded-md group">
      <img
        className="rounded-full w-8 h-8 bg-purple-700"
        src={user.photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <p className="ellipsis my-auto mr-auto ml-3 text-white">
        <span>{user.displayName}</span>
        <span className="opacity-0 text-zinc-300 group-hover:opacity-100">
          {user.discriminator}
        </span>
        <br />
        <span className="capitalize text-zinc-300 text-xs">{`${type} friend request`}</span>
      </p>
      {type === "incoming" && (
        <button className="bg-zinc-800/75 rounded-full p-2 text-white hover:text-green-500 group-hover:bg-zinc-900">
          <AiOutlineCheck />
        </button>
      )}
      <button className="bg-zinc-800/75 rounded-full ml-3 p-2 text-white hover:text-red-500 group-hover:bg-zinc-900">
        <AiOutlineClose />
      </button>
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
      <h1 className="text-white">ALL FRIENDS - {friendChats.length}</h1>
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
