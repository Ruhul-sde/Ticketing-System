// pages/UserDashboardPage.jsx
import React from 'react';
import { UserDashboardProvider } from '../context/UserDashboardContext';
import UserDashboard from '../components/user-dashboard/UserDashboard';

const UserDashboardPage = () => {
  return (
    <UserDashboardProvider>
      <UserDashboard />
    </UserDashboardProvider>
  );
};

export default UserDashboardPage;