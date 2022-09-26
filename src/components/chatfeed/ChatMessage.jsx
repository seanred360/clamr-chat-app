import { useEffect, useState } from "react";
import EditMessage from "./EditMessage";
import EmojiPicker from "./EmojiPicker";
import { BsPencilFill } from "react-icons/bs";
import { MdAddReaction } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

const ChatMessage = ({
  chatRoomUid,
  messageUid,
  displayName,
  photoURL,
  time,
  content,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState();

  const handleTogglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleEmojiSelect = (emoji) => {
    handleTogglePicker();
    handleSetReaction(emoji);
  };

  const handleSetReaction = async (emoji) => {
    const docRef = doc(db, `reactions/${messageUid}`);
    const payload = {
      [`${emoji}`]: {
        [auth.currentUser.uid]: auth.currentUser.displayName,
      },
    };
    await setDoc(docRef, payload, { merge: true });
  };

  //TODO add delete reaction function

  // const handleDeleteReaction = async (reaction) => {
  //   const docRef = doc(db, `messages/${messageUid}/reactions/${reaction}`);
  //   const docSnap = await (await getDoc(docRef)).data();
  //   const payload = {
  //     ...docSnap,
  //     [auth.currentUser.displayName]: `${reaction}`,
  //   };
  //   await setDoc(docRef, payload);
  // };

  useEffect(
    () =>
      onSnapshot(doc(db, `reactions/${messageUid}`), (snapshot) => {
        setReactions(snapshot.data());
      }),
    [messageUid]
  );

  return (
    <div className="post group mt-auto mb-10">
      <img
        key={`avatar ${uuidv4()}`}
        src={photoURL}
        alt={`${displayName}'s avatar`}
        className="avatar"
        referrerPolicy="no-referrer"
      />
      <div className="w-full">
        <div className="post-content">
          <p className="post-owner">
            {displayName}
            <small className="timestamp">{time}</small>
          </p>
          {showInput ? (
            <EditMessage
              chatRoomUid={chatRoomUid}
              messageUid={messageUid}
              content={content}
              onHide={() => setShowInput(false)}
            />
          ) : (
            <>
              <p className="post-text">{content}</p>
              <MessageToolbar
                onTogglePicker={handleTogglePicker}
                setShowInput={setShowInput}
              />
            </>
          )}
        </div>
        <ReactionsGroup
          reactions={reactions}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          onEmojiSelect={handleEmojiSelect}
        />
      </div>
      <EmojiPicker
        showPicker={showPicker}
        onTogglePicker={handleTogglePicker}
        onCancel={() => setShowPicker(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </div>
  );
};

const MessageToolbar = ({ onTogglePicker, setShowInput }) => (
  <div className="absolute min-w-max right-0 top-0 mr-6 rounded-md hover:drop-shadow-lg">
    <div className="relative bottom-4 flex items-center justify-center p-0 bg-gray-600 rounded-md">
      <MessageToolbarButtons
        extraClasses="rounded-r-none"
        icon={<MdAddReaction />}
        tooltipText="Add Reaction"
        clickEvent={onTogglePicker}
      />
      <MessageToolbarButtons
        extraClasses="rounded-l-none"
        icon={<BsPencilFill />}
        tooltipText="Edit"
        clickEvent={() => setShowInput(true)}
      />
    </div>
  </div>
);

const MessageToolbarButtons = ({
  extraClasses,
  icon,
  tooltipText,
  clickEvent,
}) => {
  return (
    <>
      <button
        className={`relative p-2 group-tooltip-edit group-hover:scale-100 bg-gray-600 text-white text-xl rounded-md hover:bg-gray-500/50 ${extraClasses} `}
        onClick={clickEvent}
      >
        {icon}
        <span className="group-tooltip-edit-hover:scale-100 tooltip tooltip-bottom mb-5 bottom-6 left-[-50%] hover:bg-gray-900">
          {tooltipText}
        </span>
      </button>
    </>
  );
};

const ReactionsGroup = ({ reactions, showPicker, setShowPicker }) => {
  if (!reactions) return null;

  const reactionsArray = Object.entries(reactions);

  return (
    <div className="max-w-xs flex items-center flex-wrap">
      {reactionsArray.map((reaction, index) => (
        <button
          key={uuidv4()}
          className="group-tooltip-emoji relative mr-2 px-1.5 py-0.5 text-sm bg-indigo-700/25 border-indigo-500 text-white border rounded-lg"
        >
          {/* {reactions[index].uid} {Object.keys(reactions[index]).length - 1} */}
          {reaction[0]} {Object.keys(reaction[1]).length}
          <div className="group-tooltip-emoji-hover:scale-100 tooltip mb-2 left-0 flex items-center hover:bg-gray-900 cursor-default">
            <span className="text-5xl">{reaction[0]}</span>
            <span>
              {(Object.values(reaction[1]) + " ").replace(/,/g, " , ")}
            </span>
          </div>
        </button>
      ))}
      <button
        className="group-tooltip-emoji py-2 text-gray-500 opacity-0 text-xl hover:text-gray-400 hover:opacity-100"
        onClick={() => setShowPicker(!showPicker)}
      >
        <MdAddReaction />
      </button>
    </div>
  );
};

export default ChatMessage;
