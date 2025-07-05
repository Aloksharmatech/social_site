import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProfile } from "../../store/user/userProfile-slice";
// import { acceptSeekerRequest, rejectSeekerRequest } from "../../store/yourActions";

const SeekersList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { profileUser, loading, error } = useSelector(
    (state) => state.userProfile
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getProfile(id));
    }
  }, [dispatch, id]);

  const isOwnProfile =
    profileUser && currentUser && profileUser._id === currentUser._id;

  const handleAccept = async (seekerId) => {
    try {
      // await dispatch(acceptSeekerRequest(seekerId)).unwrap();
      dispatch(getProfile(id));
    } catch (err) {
      console.error("Error accepting seeker:", err);
    }
  };

  const handleReject = async (seekerId) => {
    try {
      // await dispatch(rejectSeekerRequest(seekerId)).unwrap();
      dispatch(getProfile(id));
    } catch (err) {
      console.error("Error rejecting seeker:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center py-20 text-red-500">
        {error}
      </div>
    );

  if (!profileUser)
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        User not found.
      </div>
    );

  const seekers = profileUser.seekers || [];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Seekers
      </h2>

      {seekers.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No seekers yet.</div>
      ) : (
        <div className="grid gap-6">
          {seekers.map((seeker) => (
            <div
              key={seeker._id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow hover:shadow-lg transition duration-300 ease-in-out"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    seeker.sender?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt={seeker.sender?.username || "Seeker"}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <Link
                    to={`/home/profile/${seeker.sender?._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-all duration-200 ease-in-out hover:scale-105 hover:-translate-y-0.5 inline-block"
                  >
                    {seeker.sender?.username || "Unknown"}
                  </Link>

                  {/* Show status only if it's own profile */}
                  {isOwnProfile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          seeker.status === "accepted"
                            ? "text-green-600"
                            : seeker.status === "rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {seeker.status}
                      </span>
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-1">
                    Offered Amount:{" "}
                    <span className="font-medium text-blue-700">
                      ₹{seeker.offeredAmount}
                    </span>
                  </p>
                </div>
              </div>

              {/* Show Accept/Reject only on own profile and when status is pending */}
              {isOwnProfile && seeker.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(seeker._id)}
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600 transition-all duration-200 ease-in-out"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(seeker._id)}
                    className="bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600 transition-all duration-200 ease-in-out"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekersList;
