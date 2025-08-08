import React from "react";
import { Routes, Route } from "react-router-dom";

// صفحات پنل ادمین (در سطح اصلی)
import DashboardPage from "./pages/DashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import WardrobeManagementPage from "./pages/WardrobeManagementPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import CoursesPage from "./pages/Courses/CoursesPage";
import VipCoursePage from "./pages/Courses/VipCoursePage";
import GeneralCoursePage from "./pages/Courses/GeneralCoursePage";
import PrivateCoursePage from "./pages/Courses/PrivateCoursePage";
import AttendanceManagementPage from "./pages/AttendanceManagementPage";

function App() {
  return (
    <Routes>
      {/* صفحه اصلی = داشبورد */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/users" element={<AdminUsersPage />} />
      <Route path="/wardrobes" element={<WardrobeManagementPage />} />
      <Route path="/payments" element={<PaymentStatusPage />} />

      {/* دوره‌ها */}
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/vip" element={<VipCoursePage />} />
      <Route path="/courses/general" element={<GeneralCoursePage />} />
      <Route path="/courses/private" element={<PrivateCoursePage />} />
      <Route path="/attendance-management" element={<AttendanceManagementPage />} />
      {/* مسیر اشتباه */}
      <Route path="*" element={<div style={{ padding: 20 }}>404 - مسیر پیدا نشد</div>} />
    </Routes>
  );
}

export default App;
