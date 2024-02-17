import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginScreen from "../Screens/LoginScreen";
import DashboardScreen from "../Screens/DashboardScreen";

import DashboardPage from "../Pages/DashboardPage";
import OTPScreen from "../Screens/OTPScreen";
import ResetPasswordScreen from "../Screens/ResetPasswordScreen";
import VerifyEmailScreen from "../Screens/VerifyEmailScreen";
import ProfileDetails from "../Pages/ProfileDetails";
import ProtectedRoutes from "../Screens/ProtectedRoutes";
import NotFoundPage from "../Pages/NotFoundPage";
import SharedLayout from "../Screens/SharedLayout";
import ProjectsPage from "../Pages/ProjectsPage";

const AllRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <>
      <Routes>
        <Route
          index
          element={<LoginScreen />}
        />
        <Route
          path='signin'
          element={<LoginScreen />}
        />
        <Route
          path='verify-otp/*'
          element={<OTPScreen />}
        />
        <Route
          path='reset-password/*'
          element={<ResetPasswordScreen />}
        />
        <Route
          path='verify-email/*'
          element={<VerifyEmailScreen />}
        />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoutes isAuthenticated={isAuthenticated}>
              <DashboardScreen />
            </ProtectedRoutes>
          }>
          <Route
            path=''
            element={<DashboardPage />}
          />
          <Route
            path='profile'
            element={<ProfileDetails />}
          />
          <Route
            path='project'
            element={<ProjectsPage />}
          />
          <Route
            path='*'
            element={<NotFoundPage />}
          />
        </Route>
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </>
  );
};

export default AllRoutes;
