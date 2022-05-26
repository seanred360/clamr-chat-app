import { useState } from "react";
import { BsHash } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

import { useAuthContext } from "./AuthContext";
import { auth } from "./firebaseConfig";

const topics = ["tailwind-css", "react"];
const questions = ["jit-compilation", "purge-files", "dark-mode"];
const random = ["variants", "plugins"];

const ChannelBar = () => {
  return (
    <div className="channel-bar shadow-lg">
      <ChannelBlock />
      <div className="channel-container">
        <Dropdown header="Topics" selections={topics} />
        <Dropdown header="Questions" selections={questions} />
        <Dropdown header="Random" selections={random} />
      </div>
      <UserBlock />
    </div>
  );
};

const Dropdown = ({ header, selections }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="dropdown">
      <div onClick={() => setExpanded(!expanded)} className="dropdown-header">
        <ChevronIcon expanded={expanded} />
        <h5
          className={
            expanded ? "dropdown-header-text-selected" : "dropdown-header-text"
          }
        >
          {header}
        </h5>
        <FaPlus
          size="12"
          className="text-accent text-opacity-80 my-auto ml-auto"
        />
      </div>
      {expanded &&
        selections &&
        selections.map((selection) => (
          <TopicSelection key={selection} selection={selection} />
        ))}
    </div>
  );
};

const ChevronIcon = ({ expanded }) => {
  const chevClass = "text-accent text-opacity-80 my-auto mr-1";
  return expanded ? (
    <FaChevronDown size="14" className={chevClass} />
  ) : (
    <FaChevronRight size="14" className={chevClass} />
  );
};

const TopicSelection = ({ selection }) => (
  <div className="dropdown-selection">
    <BsHash size="24" className="text-gray-400" />
    <h5 className="dropdown-selection-text">{selection}</h5>
  </div>
);

const ChannelBlock = () => (
  <div className="channel-block">
    <h5 className="channel-block-text">Channels</h5>
  </div>
);

const UserBlock = () => {
  const { logout } = useAuthContext();
  const { currentUser } = auth;
  return (
    <div className="fixed w-[250px] bottom-0 flex align-center justify-center m-t-[auto] p-2 bg-gray-900/50 text-gray-400">
      <img
        className="rounded-full w-9"
        src={currentUser.photoURL}
        alt="user avatar"
      />
      <span className="relative before:absolute before:-inset-1 before:bg-green-500 before:rounded-full w-1 h-1"></span>
      <span className="text-white font-bold my-auto mr-auto">
        {currentUser.displayName}
      </span>
      <button onClick={logout}>
        <IoLogOutOutline className="text-4xl text-red-700" />
      </button>
    </div>
  );
};

export default ChannelBar;
