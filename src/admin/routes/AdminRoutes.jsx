// src/admin/routes/AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<DashboardPage />} />
    </Routes>
  );
}

export default AdminRoutes;
