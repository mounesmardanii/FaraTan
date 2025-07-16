import React, { useEffect } from "react";
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
import DashboardPage from "./admin/pages/DashpoardPage";
import AdminUsersPage from "./admin/pages/AdminUsersPage";
import ProfilePage from "./pages/ProfilePage";
import MyReservations from "./pages/MyReservations";
import MyPurchases from "./pages/MyPurchases";
import SportsProgram from "./pages/SportsProgram";
import NutritionProgram from "./pages/NutritionProgram";
import NutritionPlanDetail from "./pages/NutritionPlanDetail";
import NutritionProgramPage from "./admin/pages/NutritionProgramPage";
import FitnessProgramPage from "./admin/pages/FitnessProgramPage";
import AdminCoachesPage from "./admin/pages/AdminCoachesPage";
import WardrobeManagementPage from "./admin/pages/WardrobeManagementPage";
import PaymentStatusPage from "./admin/pages/PaymentStatusPage";
import AdminCoachSchedule from "./admin/pages/AdminCoachSchedule";
import SelectNutritionWeekPage from "./admin/pages/SelectNutritionWeekPage";
import VideoLibraryPage from "./admin/pages/VideoLibraryPage";
import { useAuth } from "./context/AuthContext";
import PaymentPage from "./pages/PaymentPage";

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

  const noNavbarRoutes = [
    "/login", "/signup", "/verify", "/loginform", "/register-info",
    "/forgot-password", "/new-password", "/admin", "/admin/users",
    "/admin/fitness", "/admin/coaches", "/admin/wardrobes", "/admin/payments",
    "/admin/add-nutrition", "/admin/add-fitness", "/admin/coach-schedule/:id",
    "/payment"
  ];

  const noFooterRoutes = [...noNavbarRoutes, "/start-training"];

  const showNavbar = !noNavbarRoutes.some(route =>
    location.pathname.startsWith(route.split(':')[0])
  );
  const showFooter = !noFooterRoutes.some(route =>
    location.pathname.startsWith(route.split(':')[0])
  );

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
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
        <Route path="/sports-program" element={<SportsProgram />} />
        <Route path="/nutrition" element={<NutritionProgram />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/nutrition/:weekId/plan" element={<NutritionPlanDetail />} />
        <Route path="/admin/videos" element={<AdminRoute><VideoLibraryPage /></AdminRoute>} />

        <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/coaches" element={<AdminRoute><AdminCoachesPage /></AdminRoute>} />
        <Route path="/admin/wardrobes" element={<AdminRoute><WardrobeManagementPage /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><PaymentStatusPage /></AdminRoute>} />
        <Route path="/admin/coach-schedule/:id" element={<AdminRoute><AdminCoachSchedule /></AdminRoute>} />
        <Route path="/admin/add-nutrition" element={<AdminRoute><NutritionProgramPage /></AdminRoute>} />
        <Route path="/admin/add-fitness" element={<AdminRoute><FitnessProgramPage /></AdminRoute>} />
        <Route path="/admin/select-nutrition-week/:userId" element={<AdminRoute><SelectNutritionWeekPage /></AdminRoute>} />
        <Route path="/admin/nutrition/:userId/:weekId" element={<AdminRoute><NutritionProgramPage /></AdminRoute>} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

function App() {
  return <LayoutWrapper />;
}

export default App;
