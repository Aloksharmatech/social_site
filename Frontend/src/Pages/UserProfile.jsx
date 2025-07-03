import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../store/user/user-slice";
import { followOrUnfollow } from "../store/user/followUnfollow-slice";
import { FaTh, FaBookmark, FaUserTag } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { fetchCurrentUser } from "../store/auth/auth-slice";

const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { profileUser, loading, error } = useSelector(
    (state) => state.userProfile
  );
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message, loading: followLoading } = useSelector(
    (state) => state.followUnfolow
  );

  useEffect(() => {
    if (id) {
      dispatch(getProfile(id));
    }
  }, [dispatch, id, message]); // Refetch profile after follow/unfollow

  const handleFollowToggle = async () => {
    try {
      await dispatch(followOrUnfollow(profileUser._id)).unwrap();
      dispatch(getProfile(profileUser._id)); // Re-fetch the target user
      dispatch(fetchCurrentUser()); // Re-fetch your own profile
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  if (!profileUser) {
    return (
      <div className="text-center py-10 text-gray-500">User not found.</div>
    );
  }

  const isFollowing = profileUser.followers?.includes(currentUser._id);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800">
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        <div className="flex flex-col items-center md:block">
          <img
            src={
              profileUser.profilePicture ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="profile"
            className="rounded-full w-36 h-36 object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h2 className="text-2xl font-light">{profileUser.username}</h2>

            {/* Follow/Unfollow Button */}
            {currentUser._id !== profileUser._id && (
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`px-4 py-1 text-sm rounded ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {followLoading
                  ? "Processing..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>

          <div className="flex gap-6 text-sm mb-4">
            <span>
              <strong>{profileUser.posts?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{profileUser.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{profileUser.following?.length || 0}</strong> following
            </span>
          </div>

          <div className="text-sm">
            <div className="font-semibold">
              {profileUser.fullName || profileUser.username}
            </div>
            <div className="text-gray-600">{profileUser.bio || ""}</div>
            {profileUser.gender && (
              <div className="text-gray-500 mt-1">
                Gender: {profileUser.gender}
              </div>
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
        {profileUser.posts?.length > 0 ? (
          profileUser.posts.map((post, i) => (
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

export default UserProfile;
