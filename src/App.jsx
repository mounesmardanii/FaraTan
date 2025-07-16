import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// صفحات کاربر
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
import SportsProgram from "./pages/SportsProgram";
import NutritionProgram from "./pages/NutritionProgram";
import NutritionPlanDetail from "./pages/NutritionPlanDetail";
import PaymentPage from "./pages/PaymentPage";

// context
import { useAuth } from "./context/AuthContext";

// ✨ مسیرهای ادمین جدا شده
import AdminRoutes from "./admin/routes/AdminRoutes";

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (user === null) return <div>در حال بارگذاری...</div>;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function LayoutWrapper() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  // مسیرهایی که نباید navbar داشته باشند
  const noNavbarRoutes = [
    "/login",
    "/signup",
    "/verify",
    "/loginform",
    "/register-info",
    "/forgot-password",
    "/new-password",
    "/admin",
    "/payment",
  ];

  // مسیرهایی که نباید footer داشته باشند
  const noFooterRoutes = [
    "/login",
    "/signup",
    "/verify",
    "/loginform",
    "/register-info",
    "/forgot-password",
    "/new-password",
    "/admin",
    "/start-training",
    "/payment",
  ];

  // تابع کمکی برای تطابق مسیرهای پارامتری
  const showNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.startsWith(route.split(":")[0])
  );
  const showFooter = !noFooterRoutes.some((route) =>
    location.pathname.startsWith(route.split(":")[0])
  );

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* صفحات کاربری */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/loginform" element={<LoginFormPage />} />
        <Route path="/register-info" element={<RegisterInfoPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/new-password" element={<NewPasswordPage />} />
        <Route path="/start-training" element={<StartTraining />} />
        <Route path="/coach-profile/:coachId" element={<CoachProfile />} />
        <Route path="/plan/1year" element={<OneYearPlan />} />
        <Route path="/plan/6months" element={<SixMonthPlan />} />
        <Route path="/plan/3months" element={<ThreeMonthPlan />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/my-purchases" element={<MyPurchases />} />
        <Route path="/sports-program" element={<SportsProgram />} />
        <Route path="/nutrition" element={<NutritionProgram />} />
        <Route path="/nutrition/:weekId/plan" element={<NutritionPlanDetail />} />
        <Route path="/payment" element={<PaymentPage />} />

        {/* مسیرهای ادمین */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          }
        />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return <LayoutWrapper />;
}

export default App;
