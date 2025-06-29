import React from "react";
import { FaRegHeart, FaComment, FaShare } from "react-icons/fa";

const posts = [
  {
    id: 1,
    username: "johndoe",
    userImg: "https://via.placeholder.com/40",
    postImg: "https://via.placeholder.com/600x600",
    likes: 120,
    caption: "Exploring nature 🌲🌳 #adventure #travel",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    username: "janedoe",
    userImg: "https://via.placeholder.com/40",
    postImg: "https://via.placeholder.com/600x600?text=Photo+2",
    likes: 85,
    caption: "Coffee date ☕️❤️",
    timeAgo: "5 hours ago",
  },
];

const HomeFeed = () => {
  return (
    <div className="space-y-10 pb-10">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-xl bg-white shadow-sm">
          {/* Post Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={post.userImg}
              alt="profile"
              className="rounded-full w-10 h-10 object-cover"
            />
            <span className="font-semibold">{post.username}</span>
          </div>

          {/* Post Image */}
          <img
            src={post.postImg}
            alt="post"
            className="w-full object-cover max-h-[700px]"
          />

          {/* Post Actions */}
          <div className="p-4 space-y-2">
            <div className="flex gap-4 text-2xl text-gray-700">
              <FaRegHeart className="cursor-pointer hover:text-red-500" />
              <FaComment className="cursor-pointer hover:text-blue-500" />
              <FaShare className="cursor-pointer hover:text-green-500" />
            </div>

            <div className="text-sm font-semibold">{post.likes} likes</div>
            <div className="text-sm">
              <span className="font-semibold">{post.username}</span>{" "}
              {post.caption}
            </div>
            <div className="text-xs text-gray-500">{post.timeAgo}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeFeed;
