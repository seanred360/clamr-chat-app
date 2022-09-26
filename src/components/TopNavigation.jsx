import {
  FaSearch,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

import useDarkMode from "./hooks/useDarkMode";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setSubChannel } from "./store/slices/uiSlice";
import { selectUserData } from "./store/slices/userDataSlice";

const TopNavigation = ({ onAddFriend }) => {
  const channel = useSelector((state) => state.ui.channel);
  const userData = useSelector(selectUserData);

  return (
    <div className="top-navigation">
      <ChannelToolbar
        pendingCount={userData.incomingFriendRequests.length}
        icon={channel === "friends" ? <FriendsIcon /> : <ChatRoomIcon />}
        title={channel}
        onAddFriend={onAddFriend}
      />
      <ThemeIcon />
      <Search />
      <BellIcon />
      <UserCircle />
    </div>
  );
};

const ChannelToolbar = ({ pendingCount, icon, title }) => {
  const [selected, setSelected] = useState("all");
  const dispatch = useDispatch();

  const handleClick = (subChannel) => {
    setSelected(subChannel);
    dispatch(setSubChannel(subChannel));
  };

  return (
    <div className="w-full h-10 flex items-center justify-left p-6 text-base text-center dark:text-white">
      <span className="mr-3 text-xl text-gray-500">{icon}</span>
      <span className="ellipsis pr-3 border-r-[1px] border-gray-600 font-bold tracking-wide capitalize w-[100px]">
        {title}
      </span>
      <button
        onClick={() => handleClick("online")}
        className={`friendsToolbarButton  ${
          selected === "online" && "selected"
        }`}
      >
        Online
      </button>
      <button
        onClick={() => handleClick("all")}
        className={`friendsToolbarButton  ${selected === "all" && "selected"}`}
      >
        All
      </button>
      <button
        onClick={() => handleClick("pending")}
        className={`friendsToolbarButton  ${
          selected === "pending" && "selected"
        }`}
      >
        Pending{" "}
        {pendingCount > 0 && (
          <span className="min-w-[16px] min-h-[16px] rounded-full bg-red-500 text-xs ml-1">
            {pendingCount}
          </span>
        )}
      </button>
      <button
        onClick={() => handleClick("blocked")}
        className={`friendsToolbarButton  ${
          selected === "blocked" && "selected"
        }`}
      >
        Blocked
      </button>
      <button
        onClick={() => handleClick("add friend")}
        className={`friendsToolbarButton friendsToolbarButton bg-green-600 text-white 
      ${selected === "add friend" && "selected"}`}
      >
        Add Friend
      </button>
    </div>
  );
};

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun size="24" className="top-navigation-icon" />
      ) : (
        <FaMoon size="24" className="top-navigation-icon" />
      )}
    </span>
  );
};

const Search = () => (
  <div className="search">
    <input className="search-input" type="text" placeholder="Search..." />
    <FaSearch size="18" className="text-secondary my-auto" />
  </div>
);
const BellIcon = () => <FaRegBell size="24" className="top-navigation-icon" />;
const UserCircle = () => (
  <FaUserCircle size="24" className="top-navigation-icon" />
);
const ChatRoomIcon = () => <MdOutlineAlternateEmail />;
const FriendsIcon = () => (
  <svg
    x="0"
    y="0"
    className="icon-2xnN2Y"
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
        transform="translate(2 4)"
      ></path>
      <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
    </g>
  </svg>
);

export default TopNavigation;
