import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import {
  collection,
  doc,
  where,
  query,
  getDocs,
  updateDoc,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ChatRoom from "../ChatRoom";
import { selectSubChannel, setChannel } from "../../store/slices/uiSlice";

const Friends = ({ onSendRequest, onCreateChatRoom, userData }) => {
  const subChannel = useSelector(selectSubChannel);

  if (subChannel === "add friend")
    return <SendFriendRequest onSendRequest={onSendRequest} />;
  if (subChannel === "pending")
    return (
      <FriendRequestsList
        userData={userData}
        onCreateChatRoom={onCreateChatRoom}
      />
    );
    if (subChannel === "blocked")
    return (
      <h1>Coming soon</h1>
    );
  return <FriendsList friendChatData={userData.friendChatData} />;
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

const SendFriendRequest = ({ onSendRequest }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [status, setStatus] = useState({ error: false, message: "" });
  const searchRef = useRef();

  const handleClick = async (e) => {
    e.preventDefault();
    const result = await onSendRequest(searchRef.current.value);
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
                status.error === true
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
          onChange={(e) => setIsTyping(e.target.value !== "")}
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
            status.error === true ? "text-red-400" : "text-green-400"
          }`}
        >
          {status.message}
        </span>
      )}
    </div>
  );
};

const FriendRequestsList = ({ userData, onCreateChatRoom }) => {
  // the path in the database to find the current user
  const userDocRef = doc(db, "users", userData.uid);
  // an array of user objects with user data
  const [incomingFriendRequests, setIncomingFriendRequests] = useState();
  const [outgoingFriendRequests, setOutgoingFriendRequests] = useState();

  useEffect(() => {
    // get the user data of the incoming or outgoing friend request
    const getFriendRequests = async (type, stateSetter) => {
      const pendingRequests = userData[type];

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

    return () => getFriendRequests();
  }, [userData]);

  const getPendingCount = () => {
    let count = 0;
    if (incomingFriendRequests) count += incomingFriendRequests.length;
    if (outgoingFriendRequests) count += outgoingFriendRequests.length;
    return count;
  };

  const handleAcceptRequest = async (requestUid) => {
    // remove request from current user's list and add to friends list
    await updateDoc(userDocRef, {
      incomingFriendRequests: arrayRemove(requestUid),
      friendsList: { ...userData.friendsList, [requestUid]: true },
    });

    // the database path to find the request user
    const requestUserDocRef = doc(db, "users", requestUid);
    // get a copy of the old data so we can push it into the new data
    const requestDocSnap = (await getDoc(requestUserDocRef)).data();
    // remove request from request users list and add to friends list
    await updateDoc(requestUserDocRef, {
      outgoingFriendRequests: arrayRemove(userData.uid),
      friendsList: { ...requestDocSnap.friendsList, [userData.uid]: true },
    });
    // remove request from our local state
    setIncomingFriendRequests(
      incomingFriendRequests.filter(
        (request) => request.incomingFriendRequests.indexOf(requestUid) === 0
      )
    );

    onCreateChatRoom([userData, requestDocSnap]);
  };

  const handleDeclineRequest = async (type, requestUid) => {
    // remove request from current user's list
    await updateDoc(userDocRef, { [type]: arrayRemove(requestUid) });

    // the database path to find the declined user
    const declinedUserDocRef = doc(db, "users", requestUid);
    // remove request from declined user's list
    if (type === "incomingFriendRequests") {
      await updateDoc(declinedUserDocRef, {
        outgoingFriendRequests: arrayRemove(userData.uid),
      });
    }
    if (type === "outgoingFriendRequests") {
      await updateDoc(declinedUserDocRef, {
        incomingFriendRequests: arrayRemove(userData.uid),
      });
    }

    // remove request from our local state
    if (type === "incomingFriendRequests") {
      const remove = incomingFriendRequests.filter(
        (request) => request[type].indexOf(requestUid) === 0
      );
      setIncomingFriendRequests(remove);
    }
    if (type === "outgoingFriendRequests") {
      const remove = outgoingFriendRequests.filter(
        (request) => request[type].indexOf(requestUid) === 0
      );
      setOutgoingFriendRequests(remove);
    }
  };

  if (!incomingFriendRequests && !outgoingFriendRequests) return null;

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
            type={"incomingFriendRequests"}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
          />
        ))}
      {outgoingFriendRequests &&
        outgoingFriendRequests.map((request) => (
          <FriendRequest
            key={`pending request ${request.uid}`}
            user={request}
            type={"outgoingFriendRequests"}
            onDecline={handleDeclineRequest}
          />
        ))}
    </div>
  );
};

const FriendRequest = ({ user, type, onAccept, onDecline }) => {
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
        <span className="capitalize text-zinc-300 text-xs">{`${
          type === "incomingFriendRequests" ? "incoming" : "outgoing"
        } friend request`}</span>
      </p>
      {type === "incomingFriendRequests" && (
        <button
          className="bg-zinc-800/75 rounded-full p-2 text-white hover:text-green-500 group-hover:bg-zinc-900"
          onClick={() => onAccept(user.uid)}
        >
          <AiOutlineCheck />
        </button>
      )}
      <button
        className="bg-zinc-800/75 rounded-full ml-3 p-2 text-white hover:text-red-500 group-hover:bg-zinc-900"
        onClick={() => onDecline(type, user.uid)}
      >
        <AiOutlineClose />
      </button>
    </div>
  );
};

const FriendsList = ({ friendChatData }) => {
  const dispatch = useDispatch();

  const handleEnterChat = () => {
    dispatch(setChannel(friendChatData.uid));
  };

  if (!friendChatData) return null;
  return (
    <div>
      <h1 className="text-white">ALL FRIENDS - {friendChatData.length}</h1>
      {friendChatData.map((chatRoom) => (
        <ChatRoom
          key={chatRoom.uid}
          chatRoomData={chatRoom}
          onEnterChat={handleEnterChat}
        />
      ))}
    </div>
  );
};

export default Friends;
