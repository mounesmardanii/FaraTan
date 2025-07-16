// src/admin/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminCoachesPage from "../pages/AdminCoachesPage";
import WardrobeManagementPage from "../pages/WardrobeManagementPage";
import PaymentStatusPage from "../pages/PaymentStatusPage";
import AdminCoachSchedule from "../pages/AdminCoachSchedule";
import NutritionProgramPage from "../pages/NutritionProgramPage";
import FitnessProgramPage from "../pages/FitnessProgramPage";
import SelectNutritionWeekPage from "../pages/SelectNutritionWeekPage";
import VideoLibraryPage from "../pages/VideoLibraryPage";
import CoursesPage from "../pages/Courses/CoursesPage";
import VipCoursePage from "../pages/Courses/VipCoursePage";
import GeneralCoursePage from "../pages/Courses/GeneralCoursePage";
import PrivateCoursePage from "../pages/Courses/PrivateCoursePage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/users" element={<AdminUsersPage />} />
      <Route path="/coaches" element={<AdminCoachesPage />} />
      <Route path="/wardrobes" element={<WardrobeManagementPage />} />
      <Route path="/payments" element={<PaymentStatusPage />} />
      <Route path="/add-nutrition" element={<NutritionProgramPage />} />
      <Route path="/add-fitness" element={<FitnessProgramPage />} />
      <Route path="/select-nutrition-week/:userId" element={<SelectNutritionWeekPage />} />
      <Route path="/nutrition/:userId/:weekId" element={<NutritionProgramPage />} />
      <Route path="/videos" element={<VideoLibraryPage />} />

      {/* دوره‌ها */}
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/vip" element={<VipCoursePage />} />
      <Route path="/courses/general" element={<GeneralCoursePage />} />
      <Route path="/courses/private" element={<PrivateCoursePage />} />
    </Routes>
  );
}

export default AdminRoutes;
