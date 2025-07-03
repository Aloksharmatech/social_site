import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSuggestedUsers } from "../../store/user/suggestedUser-slice";
import { Link } from "react-router-dom";

const RightSide = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    users: suggestedUsers,
    loading,
    error,
  } = useSelector((state) => state.suggestion);

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  return (
    <aside className="hidden xl:block w-80 p-6">
      {/* Current User Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            user?.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="profile"
          className="rounded-full w-10 h-10 object-cover"
        />
        <div>
          <div className="font-semibold">{user?.username}</div>
          <div className="text-sm text-gray-500">{user?.username}</div>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="text-sm font-semibold text-gray-500 mb-2">
        Suggested for you
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-gray-400">Loading suggestions...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : suggestedUsers.length > 0 ? (
          suggestedUsers.map((suggestedUser) => (
            <div
              key={suggestedUser._id}
              className="flex items-center justify-between"
            >
              <Link
                to={`profile/${suggestedUser._id}`}
                className="flex items-center gap-3 hover:underline"
              >
                <img
                  src={
                    suggestedUser.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  className="rounded-full w-8 h-8 object-cover"
                  alt={suggestedUser.username}
                />
                <span className="text-sm font-semibold">
                  {suggestedUser.username}
                </span>
              </Link>
              <button className="text-blue-500 text-sm">Follow</button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">No suggestions available.</div>
        )}
      </div>
    </aside>
  );
};

export default RightSide;
