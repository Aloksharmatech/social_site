import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchFollowers } from "../../store/user/userFollower-slice";
import { followOrUnfollow } from "../../store/user/followUnfollow-slice";
import { fetchCurrentUser } from "../../store/auth/auth-slice";

const FollowersList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { followers, loading, error } = useSelector(
    (state) => state.userFollowers
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchFollowers(id));
    }
  }, [dispatch, id]);

  const handleFollowToggle = async (targetUserId) => {
    try {
      await dispatch(followOrUnfollow(targetUserId)).unwrap();
      dispatch(fetchFollowers(id));
      await dispatch(fetchCurrentUser());
    } catch (err) {
      console.error("Error following/unfollowing user:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading followers...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        {error}
      </div>
    );

  if (!followers || followers.length === 0)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        No followers yet.
      </div>
    );

  const followingIds = currentUser.following?.map((user) => user._id) || [];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Followers
      </h2>

      <div className="grid gap-6">
        {followers.map((follower) => {
          const isFollowing = followingIds.includes(follower._id);

          return (
            <div
              key={follower._id}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow hover:shadow-lg transition duration-300 ease-in-out"
            >
              <Link
                to={`/home/profile/${follower._id}`}
                className="flex items-center gap-4"
              >
                <img
                  src={
                    follower.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-in-out inline-block">
                  {follower.username}
                </span>
              </Link>

              {currentUser._id !== follower._id && (
                <button
                  onClick={() => handleFollowToggle(follower._id)}
                  className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-200 ease-in-out ${
                    isFollowing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FollowersList;
