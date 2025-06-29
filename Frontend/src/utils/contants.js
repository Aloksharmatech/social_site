import {
  FaHome,
  FaSearch,
  FaRegHeart,
  FaCompass,
  FaFacebookMessenger,
  FaPlusSquare,
} from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
export const navItems = [
    { to: "/auth/home", icon: FaHome, label: "Home" },
    { to: "/auth/search", icon: FaSearch, label: "Search" },
    { to: "/auth/explore", icon: MdOutlineExplore, label: "Explore" },
    { to: "/auth/messages", icon: FaFacebookMessenger , label: "Messages" },
    { to: "/auth/notifications", icon: FaRegHeart, label: "Notifications" },
    { to: "/auth/create", icon: FaPlusSquare, label: "Create" },
    { to: "/auth/profile", icon: CgProfile, label: "Profile" },
  ];