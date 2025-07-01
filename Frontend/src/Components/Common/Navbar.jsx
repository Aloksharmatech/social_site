import React from "react";
import {
  FaHome,
  FaSearch,
  FaRegHeart,
  FaCompass,
  FaFacebookMessenger,
  FaPlusSquare,
  FaSignOutAlt, 
} from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth/auth-slice"; // adjust the import as per your structure

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login"); 
  };

  const navItems = [
    { to: "/home", icon: <FaHome />, label: "Home" },
    { to: "/search", icon: <FaSearch />, label: "Search" },
    { to: "/explore", icon: <MdOutlineExplore />, label: "Explore" },
    { to: "/messages", icon: <FaFacebookMessenger />, label: "Messages" },
    { to: "/notifications", icon: <FaRegHeart />, label: "Notifications" },
    { to: "/create", icon: <FaPlusSquare />, label: "Create" },
    { to: "profile", icon: <CgProfile />, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r px-6 py-8 space-y-6 sticky top-0 h-screen bg-white">
        <div className="text-3xl font-bold mb-6">Instagram</div>
        <nav className="flex flex-col gap-4 flex-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={`flex items-center gap-3 text-lg hover:font-semibold ${
                location.pathname === item.to ? "font-bold" : ""
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-lg text-red-600 hover:font-semibold"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Mobile Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center py-2 z-50">
        {navItems.map((item, index) => (
          <Link key={index} to={item.to} className="text-xl text-gray-700">
            {item.icon}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
