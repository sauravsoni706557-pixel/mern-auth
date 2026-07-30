import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Dashboard jaise pages ko is component se wrap karte hain
// Agar user login nahi hai, toh seedha login page bhej do
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
