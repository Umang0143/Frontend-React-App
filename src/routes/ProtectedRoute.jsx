import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("idToken") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
