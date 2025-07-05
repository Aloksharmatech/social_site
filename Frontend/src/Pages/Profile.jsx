import React, { useEffect, useState } from "react";
import { FaTh, FaBookmark, FaUserTag } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchCurrentUser,
  editProfile,
  deleteProfilePicture,
} from "../store/auth/auth-slice";
import { toast, ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, isBootstrapped, status, error } =
    useSelector((state) => state.auth);

  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setBio(user.bio || "");
      setGender(user.gender || "");
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isBootstrapped && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isBootstrapped, isAuthenticated, navigate]);

  const handleProfileUpdate = () => {
    const formData = new FormData();
    if (profilePicture) formData.append("profilePicture", profilePicture);
    formData.append("bio", bio);
    formData.append("gender", gender.toLowerCase());

    dispatch(editProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch(() => {
        toast.error("Failed to update profile.");
      });
  };

  const handleProfilePictureDelete = () => {
    dispatch(deleteProfilePicture())
      .unwrap()
      .then(() => {
        setProfilePicture(null);
        toast.success("Profile picture removed.");
      })
      .catch(() => {
        toast.error("Failed to delete profile picture.");
      });
  };

  if (!isBootstrapped || loading || !user) {
    return (
      <div className="text-center py-10 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        <div className="flex flex-col items-center md:block">
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
            <>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="mt-2"
              />
              {user.profilePicture && (
                <button
                  onClick={handleProfilePictureDelete}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-1">
                      <ClipLoader size={16} color="#dc2626" /> Removing
                      picture...
                    </span>
                  ) : (
                    "Remove current picture"
                  )}
                </button>
              )}
              {status === "failed" && error && (
                <div className="text-red-600 text-xs mt-1">{error}</div>
              )}
            </>
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
                {status === "loading" ? (
                  <ClipLoader size={16} color="#fff" />
                ) : (
                  "Save"
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-sm mb-4">
            <span>
              <strong>{user.posts?.length || 0}</strong> posts
            </span>
            <Link
              to={`profile/followers/${user._id}`}
              className="hover:underline"
            >
              <strong>{user.followers?.length || 0}</strong> followers
            </Link>
            <Link
              to={`profile/following/${user._id}`}
              className="hover:underline"
            >
              <strong>{user.following?.length || 0}</strong> following
            </Link>
            <Link
              to={`profile/seekers/${user._id}`}
              className="hover:underline"
            >
              <strong>{user.seekers?.length || 0}</strong> seekers
            </Link>
            <Link to={`profile/picks/${user._id}`} className="hover:underline">
              <strong>{user.picks?.length || 0}</strong> picks
            </Link>
          </div>

          <div className="text-sm">
            <div className="font-semibold">
              {user.fullName || user.username}
            </div>
            {isEditing ? (
              <>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                  placeholder="Add a bio"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border p-2 rounded mt-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            ) : (
              <>
                <div className="text-gray-600">{user.bio || "Add a bio"}</div>
                {user.gender && (
                  <div className="text-gray-500 mt-1 hidden">
                    Gender: {user.gender}
                  </div>
                )}
              </>
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

      <ToastContainer
        position="top-center"
        autoClose={500}
        toastClassName="text-sm p-2 rounded-lg shadow-md"
        bodyClassName="text-sm"
      />
    </div>
  );
};

export default Profile;
