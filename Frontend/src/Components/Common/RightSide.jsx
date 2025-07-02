import React from 'react'
import { useSelector } from 'react-redux';

const RightSide = () => {
  const {user} = useSelector((state)=>state.auth);

  return (
    <>
      {" "}
      <aside className="hidden xl:block w-80 p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.profilePicture}
            alt="profile"
            className="rounded-full w-10 h-10"
          />
          <div>
            <div className="font-semibold">{user.username}</div>
            <div className="text-sm text-gray-500">{user.username}</div>
          </div>
        </div>
        <div className="text-sm font-semibold text-gray-500 mb-2">
          Suggested for you
        </div>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://picsum.photos/200"
                    className="rounded-full w-8 h-8"
                    alt="suggested"
                  />
                  <span className="text-sm font-semibold">user_{i}</span>
                </div>
                <button className="text-blue-500 text-sm">Follow</button>
              </div>
            ))}
        </div>
      </aside>
    </>
  );
}

export default RightSide