import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps protected pages - redirects to /login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
