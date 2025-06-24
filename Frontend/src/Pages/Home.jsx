import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Common/Navbar";
import RightSide from "../Components/Common/RightSide";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <Navbar/>
      
      {/* Main Feed */}
      <main className="flex-1 max-w-2xl mx-auto py-8 px-4">
        <Outlet />
      </main>
      
      {/* Right Sidebar */}
      <RightSide/>
    </div>
  );
};
export default Home;
