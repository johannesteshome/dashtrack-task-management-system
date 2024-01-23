import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes({ isAuthenticated, children }) {
  console.log(isAuthenticated, "isAuthenticated");
  if (!isAuthenticated) {
    return <Navigate to='/signin' replace />;
  }
  return children;
}
