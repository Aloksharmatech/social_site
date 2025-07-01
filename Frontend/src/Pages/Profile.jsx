import React, { useEffect, useState } from "react";
import { FaTh, FaBookmark, FaUserTag } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../store/auth/auth-slice";
import API from "../api/axios";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, isBootstrapped } = useSelector(
    (state) => state.auth
  );

  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setBio(user.bio || "");
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isBootstrapped && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isBootstrapped, isAuthenticated, navigate]);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    if (profilePicture) formData.append("profilePicture", profilePicture);
    formData.append("bio", bio);

    try {
      await API.put("/auth/update-profile", formData);
      dispatch(fetchCurrentUser());
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (!isBootstrapped || loading || !user) {
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        <div className="flex justify-center md:block">
          <label htmlFor="profilePicture">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : user.profilePicture || "https://via.placeholder.com/150"
              }
              alt="profile"
              className="rounded-full w-36 h-36 object-cover cursor-pointer"
            />
          </label>
          {isEditing && (
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="mt-2"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-light">{user.username}</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-100 text-sm px-4 py-1 rounded-md font-semibold"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            {isEditing && (
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-500 text-white text-sm px-4 py-1 rounded-md font-semibold"
              >
                Save
              </button>
            )}
          </div>

          <div className="flex gap-6 text-sm mb-4">
            <span>
              <strong>{user.posts?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> following
            </span>
          </div>

          <div className="text-sm">
            <div className="font-semibold">
              {user.fullName || user.username}
            </div>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded mt-1"
                placeholder="Add a bio"
              />
            ) : (
              <div className="text-gray-600">{user.bio || "Add a bio"}</div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-300" />

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

      <div className="grid grid-cols-3 gap-1 mt-6">
        {user.posts?.length > 0 ? (
          user.posts.map((post, i) => (
            <img
              key={i}
              src={
                post.image ||
                `https://via.placeholder.com/300?text=Post+${i + 1}`
              }
              alt={`Post ${i + 1}`}
              className="w-full h-80 object-cover"
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 mt-6">
            No posts yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
