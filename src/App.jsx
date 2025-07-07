import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import LoginFormPage from "./pages/LoginFormPage";
import RegisterInfoPage from "./pages/RegisterInfoPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import CoachProfile from "./pages/CoachProfile";
import StartTraining from "./pages/StartTraining";
import OneYearPlan from "./pages/TrainingPlans/OneYearPlan";
import SixMonthPlan from "./pages/TrainingPlans/SixMonthPlan";
import ThreeMonthPlan from "./pages/TrainingPlans/ThreeMonthPlan";
import ProfilePage from "./pages/ProfilePage";
import MyReservations from "./pages/MyReservations";
import MyPurchases from "./pages/MyPurchases";

// Admin pages
import DashboardPage from "./admin/pages/DashpoardPage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import AddFitnessClassPage from "./admin/pages/AddFitnessClassPage";
import AdminCoachesPage from "./admin/pages/AdminCoachesPage";
import WardrobeManagementPage from "./admin/pages/WardrobeManagementPage";
import PaymentStatusPage from "./admin/pages/PaymentStatusPage"; // 🆕 Added

import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user === null) return <div>در حال بارگذاری...</div>;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function LayoutWrapper() {
  const location = useLocation();
  const hideLayout = [
    "/login",
    "/signup",
    "/verify",
    "/loginform",
    "/register-info",
    "/forgot-password",
    "/new-password",
    "/admin",
    "/admin/users",
    "/admin/fitness",
    "/admin/coaches",
    "/admin/wardrobes",
    "/admin/payments" // 🆕 Hide layout in this route
  ].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/loginform" element={<LoginFormPage />} />
        <Route path="/register-info" element={<RegisterInfoPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/start-training" element={<StartTraining />} />
        <Route path="/coach-profile" element={<CoachProfile />} />
        <Route path="/plan/1year" element={<OneYearPlan />} />
        <Route path="/plan/6months" element={<SixMonthPlan />} />
        <Route path="/plan/3months" element={<ThreeMonthPlan />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-purchases" element={<MyPurchases />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/fitness" element={<AdminRoute><AddFitnessClassPage /></AdminRoute>} />
        <Route path="/admin/coaches" element={<AdminRoute><AdminCoachesPage /></AdminRoute>} />
        <Route path="/admin/wardrobes" element={<AdminRoute><WardrobeManagementPage /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><PaymentStatusPage /></AdminRoute>} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return <LayoutWrapper />;
}

export default App;
