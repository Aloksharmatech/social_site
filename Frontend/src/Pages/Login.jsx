import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  clearError,
  clearMessage,
} from "../store/auth/auth-slice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Please fill in both email and password");
    }

    dispatch(loginUser({ email, password }));

  };


  useEffect(() => {
    console.log("Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]);
  
  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(isAuthenticated);
      navigate("/home");
    }
  }, [isAuthenticated, user, navigate]);

  // Show errors/messages
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }

    if (message) {
      alert(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-pink-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
