import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ needAdmin }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (needAdmin && !isAdmin) {
    return <Navigate to="/auth/feitcity/account/login" />;
  }
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/feitcity/account/login" />
  );
};

export default ProtectedRoute;
