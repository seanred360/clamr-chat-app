import { useState } from "react";
import EditMessage from "./EditMessage";
import { BsPencilFill } from "react-icons/bs";
import { MdAddReaction } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Post = ({ id, displayName, photoURL, time, content, reactions }) => {
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="post group">
      <img
        key={uuidv4()}
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
              id={id}
              content={content}
              onHide={() => setShowInput(false)}
            />
          ) : (
            <>
              <p className="post-text">{content}</p>
              <MessageToolbar />
            </>
          )}
        </div>
        <ReactionsGroup reactions={reactions} />
      </div>
    </div>
  );
};

const MessageToolbar = () => (
  <div className="absolute min-w-max right-0 top-0 mr-6 rounded-md hover:drop-shadow-lg">
    <div className="relative bottom-4 flex items-center justify-center p-0 bg-gray-600 rounded-md">
      <MessageToolbarButtons
        extraClasses="rounded-r-none"
        icon={<MdAddReaction />}
        tooltipText="Add Reaction"
      />
      <MessageToolbarButtons
        extraClasses="rounded-l-none"
        icon={<BsPencilFill />}
        tooltipText="Edit"
      />
    </div>
  </div>
);

const MessageToolbarButtons = ({ extraClasses, icon, tooltipText }) => (
  <button
    className={`relative p-2 group-tooltip-edit group-hover:scale-100 bg-gray-600 text-white text-xl rounded-md hover:bg-gray-500/50 ${extraClasses} `}
  >
    {icon}
    <span className="group-tooltip-edit-hover:scale-100 tooltip tooltip-bottom mb-5 bottom-6 left-[-50%] hover:bg-gray-900">
      {tooltipText}
    </span>
  </button>
);

const ReactionsGroup = ({ reactions }) => {
  const emojis = { happy: "😄", sad: "😥" };

  if (!reactions) return null;
  return (
    <div className="flex items-center">
      {Object.entries(reactions).map((reaction) => (
        <span
          key={uuidv4()}
          className="group-tooltip-emoji relative w-fit mr-2 px-1.5 py-0.5 text-sm bg-indigo-700/25 border-indigo-500 text-white border rounded-lg"
        >
          {emojis[`${reaction[0]}`]} {`${reaction[1].length}`}
          <div className="group-tooltip-emoji-hover:scale-100 tooltip mb-2 left-0 flex items-center ">
            <span className="text-5xl">{emojis[`${reaction[0]}`]}</span>
            <span>{`${reaction[1]} reacted with ${reaction[0]}`}</span>
          </div>
        </span>
      ))}
      <span className="group-tooltip-emoji py-2 text-gray-500 opacity-0 text-xl hover:text-gray-400 hover:opacity-100">
        <MdAddReaction />
      </span>
    </div>
  );
};

export default Post;
