import { useState, useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { collection, where, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import GroupIcon from "./GroupIcon.svg";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { setChannel } from "../store/slices/uiSlice";

const ChatRoom = ({ chatRoomData }) => {
  const [chatMembers, setChatMembers] = useState();
  const { user } = useAuthContext();
  const channel = useSelector((state) => state.ui.channel);
  const dispatch = useDispatch();

  useEffect(() => {
    const setDisplayData = (chatMemberArray) => {
      // remove the current user from the members because we do not need to display their photo or name to themself
      const filteredMembers = chatMemberArray.filter(
        (member) => member.uid !== user.uid
      );

      if (chatRoomData.isGroup === true) {
        let chatMemberNames = [];
        filteredMembers.forEach(
          (member) => (chatMemberNames += member.displayName + ", ")
        );

        setChatMembers({
          photoURL: GroupIcon,
          displayName: chatMemberNames,
        });
      } else {
        setChatMembers(filteredMembers[0]);
      }
    };

    const getChatMembersData = async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "in", [...chatRoomData.members]));
      const querySnapshot = await getDocs(q);
      let membersData = [];
      querySnapshot.forEach((doc) => {
        membersData = [...membersData, doc.data()];
      });
      setDisplayData(membersData);
    };
    getChatMembersData();
  }, [chatRoomData,user]);

  if (!chatMembers) return null;
  return (
    <button
      className={`channelButton ${channel === chatRoomData.name && "selected"}`}
      onClick={() => dispatch(setChannel(chatRoomData.uid))}
    >
      <img
        className="rounded-full w-8 h-8 bg-purple-700"
        src={chatMembers.photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="ellipsis my-auto mr-auto ml-3">
        {chatMembers.displayName}
      </span>
    </button>
  );
};
export default ChatRoom;
