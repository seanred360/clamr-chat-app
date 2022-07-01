import {
  FaSearch,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import useDarkMode from "./hooks/useDarkMode";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setSubChannel } from "./store/slices/uiSlice";

const TopNavigation = ({ onAddFriend }) => {
  const channel = useSelector((state) => state.ui.channel);

  return (
    <div className="top-navigation">
      <ChannelToolbar
        icon={channel == "friends" ? <FriendsIcon /> : <ChatRoomIcon />}
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

const ChannelToolbar = ({ icon, title }) => {
  const [selected, setSelected] = useState();
  const dispatch = useDispatch();

  const handleClick = (selectedButton) => {
    setSelected(selectedButton);
    dispatch(setSubChannel(selectedButton));
  };

  return (
    <div className="w-full h-10 flex items-center justify-left p-6 text-base text-center text-white">
      <span className="mr-3 text-xl text-gray-500">{icon}</span>
      <span className="ellipsis pr-3 border-r-[1px] border-gray-600 font-bold tracking-wide capitalize">
        {title}
      </span>
      <button
        onClick={() => handleClick("online")}
        className={`friendsToolbarButton  ${
          selected == "online" && "selected"
        }`}
      >
        Online
      </button>
      <button
        onClick={() => handleClick("all")}
        className={`friendsToolbarButton  ${selected == "all" && "selected"}`}
      >
        All
      </button>
      <button
        onClick={() => handleClick("pending")}
        className={`friendsToolbarButton  ${
          selected == "pending" && "selected"
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => handleClick("blocked")}
        className={`friendsToolbarButton  ${
          selected == "blocked" && "selected"
        }`}
      >
        Blocked
      </button>
      <button
        onClick={() => handleClick("add friend")}
        className={`friendsToolbarButton friendsToolbarButton bg-green-600 text-white 
      ${selected == "add friend" && "selected"}`}
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
const FriendsIcon = () => <FaUserFriends />;

export default TopNavigation;
