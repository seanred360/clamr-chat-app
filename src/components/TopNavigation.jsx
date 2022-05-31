import {
  FaSearch,
  FaHashtag,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import useDarkMode from "./hooks/useDarkMode";
import { FaUserFriends } from "react-icons/fa";

const TopNavigation = () => {
  return (
    <div className="top-navigation">
      {/* <HashtagIcon /> */}
      <FriendsToolbar />
      {/* <Title /> */}
      <ThemeIcon />
      <Search />
      <BellIcon />
      <UserCircle />
    </div>
  );
};

const FriendsToolbar = () => {
  return (
    <div className="w-full h-10 flex items-center justify-left p-6 text-base text-center text-white">
      <span className="mr-3 text-xl text-gray-500">
        <FaUserFriends />
      </span>
      <span className="pr-3 border-r-[1px] border-gray-600 font-bold tracking-wide">
        Friends
      </span>
      <button className="friendsToolbarButton">Online</button>
      <button className="friendsToolbarButton">All</button>
      <button className="friendsToolbarButton">Pending</button>
      <button className="friendsToolbarButton">Blocked</button>
      <button className="friendsToolbarButton text-green-600">Add Friend</button>
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
const HashtagIcon = () => <FaHashtag size="20" className="title-hashtag" />;
const Title = () => <h5 className="title-text">tailwind-css</h5>;

export default TopNavigation;
