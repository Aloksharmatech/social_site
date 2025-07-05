import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home"; // this should have <Outlet />
import Profile from "./Pages/Profile";
import HomeFeed from "./Pages/HomeFeed";
import PrivateRoute from "./routes/PrivateRoute";
import NotFound from "./Pages/Notfound";
import { fetchCurrentUser } from "./store/auth/auth-slice";
import UserProfile from "./Pages/UserProfile";
import FollowersList from "./Components/Common/FollowerList";
import FollowingList from "./Components/Common/FollowingList";
import SeekersList from "./Components/Common/SeekersList";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<HomeFeed />} />

          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="profile/:id"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="profile/:id/followers/:id"
            element={
              <PrivateRoute>
                <FollowersList />
              </PrivateRoute>
            }
          />

          <Route
            path="profile/:id/following/:id"
            element={
              <PrivateRoute>
                <FollowingList />
              </PrivateRoute>
            }
          />
          <Route
            path="profile/:id/seekers/:id"
            element={
              <PrivateRoute>
                <SeekersList />
              </PrivateRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
