import { BsPlus, BsGearFill } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";
import { IoCompass } from "react-icons/io5";
import { HiOutlineDownload } from "react-icons/hi";

const SideBar = () => {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
    >
      <SideBarIcon icon={<SiDiscord size="28" />} text="Home" />
      <Divider />
      <SideBarIcon icon={<BsPlus size="32" />} text="Coming soon" />
      <SideBarIcon
        icon={<IoCompass size="20" />}
        text="Coming soon"
      />
      <Divider />
      <SideBarIcon
        icon={<HiOutlineDownload />}
        size="22"
        text="Coming soon"
      />
    </div>
  );
};

const SideBarIcon = ({ icon, text = "tooltip 💡" }) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="tooltip tooltip-left p-2 m-2 left-14 bottom-0 origin-left group-hover:scale-100">
      {text}
    </span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
