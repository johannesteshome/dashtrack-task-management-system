import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginScreen from "../Screens/LoginScreen";
import DashboardScreen from "../Screens/DashboardScreen";

import DashboardPage from "../Pages/DashboardPage";
import TeachersPage from "../Pages/TeachersPage";
import StudentsPage from "../Pages/StudentsPage";
import AdminsPage from "../Pages/AdminsPage";
import CoursesPage from "../Pages/CoursesPage";
import LogsPage from "../Pages/LogsPage";
import AddTeacher from "../Pages/AddTeacher";
import AddStudent from "../Pages/AddStudent";
import AddAdmin from "../Pages/AddAdmin";
import NotFoundPage from "../Pages/NotFoundPage";
import ProtectedRoutes from "../Screens/ProtectedRoutes";
import SharedLayout from "../Screens/SharedLayout";
import { useSelector } from "react-redux";
import MyCoursesPage from "../Pages/MyCoursesPage";
import TakeAttendancePage from "../Pages/TakeAttendancePage";
import CourseDetailsPage from "../Pages/CourseDetailsPage";
import AttendanceDetailsPage from "../Pages/AttendanceDetailsPage";
import ProfileDetails from "../Pages/ProfileDetails";
import OTPScreen from "../Screens/OTPScreen";
import ResetPasswordScreen from "../Screens/ResetPasswordScreen";
import VerifyEmailScreen from "../Screens/VerifyEmailScreen";
import DepartmentsPage from "../Pages/DepartmentsPage";
import AddCourse from "../Pages/AddCourse";

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
            path='teachers-page'
            element={<TeachersPage />}
          />
          <Route
            path='students-page'
            element={<StudentsPage />}
          />
          <Route
            path='admins-page'
            element={<AdminsPage />}
          />
          <Route
            path='courses-page'
            element={<CoursesPage />}
          />
          <Route
            path='departments-page'
            element={<DepartmentsPage />}
          />
          <Route
            path='logs-page'
            element={<LogsPage />}
          />
          <Route
            path='add-teacher'
            element={<AddTeacher />}
          />
          <Route
            path='add-student'
            element={<AddStudent />}
          />
          <Route
            path='add-admin'
            element={<AddAdmin />}
          />
          <Route
            path='add-course'
            element={<AddCourse />}
          />
          <Route
            path='my-courses'
            element={<MyCoursesPage />}
          />
          <Route
            path='courses/:courseId'
            element={<CourseDetailsPage />}
          />
          <Route
            path='attendances/:attendanceId'
            element={<AttendanceDetailsPage />}
          />
          <Route
            path='take-attendance'
            element={<TakeAttendancePage />}
          />
          <Route
            path='profile'
            element={<ProfileDetails />}
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
