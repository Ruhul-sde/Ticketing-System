// pages/SuperAdminDashboardPage.jsx
import React from 'react';
import { SuperAdminDashboardProvider } from '../context/SuperAdminContext';
import SuperAdminDashboard from '../components/super-admin/SuperAdminDashboard';

const SuperAdminDashboardPage = () => {
  return (
    <SuperAdminDashboardProvider>
      <SuperAdminDashboard />
    </SuperAdminDashboardProvider>
  );
};

export default SuperAdminDashboardPage;