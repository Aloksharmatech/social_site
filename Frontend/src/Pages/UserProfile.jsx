import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../store/user/userProfile-slice";
import { followOrUnfollow } from "../store/user/followUnfollow-slice";
import { fetchCurrentUser } from "../store/auth/auth-slice";
import { FaTh, FaBookmark, FaUserTag } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { createPickRequest } from "../store/pickRequest/pickRequest-slice";

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

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    offeredAmount: "",
    duration: "",
    durationUnit: "minutes",
    expirationDuration: "",
    expirationUnit: "minutes",
  });

  useEffect(() => {
    if (id) {
      dispatch(getProfile(id));
    }
  }, [dispatch, id, message]);

  const handleFollowToggle = async () => {
    try {
      await dispatch(followOrUnfollow(profileUser._id)).unwrap();
      dispatch(getProfile(profileUser._id));
      dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  const handlePickToggle = () => {
    setShowOfferForm((prev) => !prev);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      receiverId: profileUser._id,
      offeredAmount: Number(offerData.offeredAmount),
      duration: {
        value: Number(offerData.duration),
        unit: offerData.durationUnit,
      },
      expirationDuration: {
        value: Number(offerData.expirationDuration),
        unit: offerData.expirationUnit,
      },
    };

    console.log("Sending Pick Request:", payload);

    try {
      dispatch(createPickRequest(payload))
        .unwrap()
        .then((data) => {
          console.log("Pick Request Created:", data);
          // toast.success("Offer sent successfully!");
          setShowOfferForm(false);
          dispatch(fetchCurrentUser());
        });
    } catch (err) {
      console.error("Error creating pick request:", err);
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
    <div className="max-w-4xl mx-auto py-10 px-4 text-gray-800 relative">
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

            {currentUser._id !== profileUser._id && (
              <div className="flex gap-3">
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

                <button
                  onClick={handlePickToggle}
                  className="px-4 py-1 text-sm rounded bg-green-500 text-white"
                >
                  {showOfferForm ? "Cancel" : "Pick"}
                </button>
              </div>
            )}
          </div>

          {showOfferForm && (
            <form
              onSubmit={handleOfferSubmit}
              className="bg-gray-50 p-4 rounded-md mb-4 shadow-sm space-y-3 w-full max-w-md"
            >
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={offerData.offeredAmount}
                  onChange={(e) =>
                    setOfferData({
                      ...offerData,
                      offeredAmount: e.target.value,
                    })
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={offerData.duration}
                    onChange={(e) =>
                      setOfferData({ ...offerData, duration: e.target.value })
                    }
                    className="w-1/2 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Value"
                    required
                  />
                  <select
                    value={offerData.durationUnit}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        durationUnit: e.target.value,
                      })
                    }
                    className="w-1/2 p-2 text-sm border border-gray-300 rounded focus:outline-none"
                  >
                    <option value="minutes">Min</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Expiration Duration
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={offerData.expirationDuration}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        expirationDuration: e.target.value,
                      })
                    }
                    className="w-1/2 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Value"
                    required
                  />
                  <select
                    value={offerData.expirationUnit}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        expirationUnit: e.target.value,
                      })
                    }
                    className="w-1/2 p-2 text-sm border border-gray-300 rounded focus:outline-none"
                  >
                    <option value="minutes">Min</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded w-full"
                >
                  Send Offer
                </button>
              </div>
            </form>
          )}

          {!showOfferForm && (
            <>
              <div className="flex gap-6 text-sm mb-4">
                <span>
                  <strong>{profileUser.posts?.length || 0}</strong> posts
                </span>
                <Link
                  to={`followers/${profileUser._id}`}
                  className="hover:underline"
                >
                  <strong>{profileUser.followers?.length || 0}</strong>{" "}
                  followers
                </Link>
                <Link
                  to={`following/${profileUser._id}`}
                  className="hover:underline"
                >
                  <strong>{profileUser.following?.length || 0}</strong>{" "}
                  following
                </Link>
                <Link
                  to={`seekers/${profileUser._id}`}
                  className="hover:underline"
                >
                  <strong>{profileUser.seekers?.length || 0}</strong> seekers
                </Link>
                <Link
                  to={`picks/${profileUser._id}`}
                  className="hover:underline"
                >
                  <strong>{profileUser.picks?.length || 0}</strong> picks
                </Link>
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
            </>
          )}
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
      </div>
    </div>
  );
};

export default UserProfile;