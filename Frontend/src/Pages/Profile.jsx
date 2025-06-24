import React from "react";
import { FaTh, FaBookmark, FaUserTag } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        {/* Profile Picture */}
        <div className="flex justify-center md:block">
          <img
            src="https://via.placeholder.com/150"
            alt="profile"
            className="rounded-full w-36 h-36 object-cover"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-light">your_username</h2>
            <button className="bg-gray-100 text-sm px-4 py-1 rounded-md font-semibold">
              Edit Profile
            </button>
            <button className="text-sm px-2 py-1">⚙️</button>
          </div>

          <div className="flex gap-6 text-sm mb-4">
            <span>
              <strong>24</strong> posts
            </span>
            <span>
              <strong>1.2k</strong> followers
            </span>
            <span>
              <strong>180</strong> following
            </span>
          </div>

          <div className="text-sm">
            <div className="font-semibold">Your Full Name</div>
            <div className="text-gray-600">Web Developer | Coffee Lover ☕</div>
            <a href="#" className="text-blue-500">
              yourportfolio.com
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-8 border-gray-300" />

      {/* Tabs */}
      <div className="flex justify-center gap-10 text-sm uppercase font-semibold text-gray-500 tracking-widest">
        <div className="flex items-center gap-2 cursor-pointer">
          <FaTh />
          <span>Posts</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <MdOutlineVideoLibrary />
          <span>Reels</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <FaBookmark />
          <span>Saved</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserTag />
          <span>Tagged</span>
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1 mt-6">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <img
              key={i}
              src={`https://via.placeholder.com/300?text=Post+${i + 1}`}
              alt={`Post ${i + 1}`}
              className="w-full h-80 object-cover"
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
