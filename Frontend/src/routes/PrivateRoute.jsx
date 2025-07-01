import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Components/Common/Loader";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isBootstrapped } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isBootstrapped) {
    return <Loader message="Loading..."/>;
  }

  if (!isAuthenticated) {
    console.log("🔒 Redirecting to /login from:", location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
