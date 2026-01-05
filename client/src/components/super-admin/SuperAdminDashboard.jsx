// components/super-admin/SuperAdminDashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { useSuperAdmin } from '../../context/SuperAdminContext';
import axios from 'axios';

// Import Components
import BackgroundScene from './BackgroundScene';
import LoadingScreen from './LoadingScreen';
import ErrorDisplay from './ErrorDisplay';
import Header from './Header';
import Navigation from './Navigation';
import DashboardContent from './DashboardContent';
import Modals from './Modals';

const SuperAdminDashboard = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const { 
    setStats, setUsers, setDepartments, setTickets, 
    setAdminProfiles, setCompanies, setLoading, setError,
    API_URL // Get API_URL from SuperAdminContext
  } = useSuperAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      const responses = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, config),
        axios.get(`${API_URL}/users`, config),
        axios.get(`${API_URL}/departments`, config),
        axios.get(`${API_URL}/tickets`, config),
        axios.get(`${API_URL}/admin-profiles`, config),
        axios.get(`${API_URL}/companies`, config)
      ]);

      setStats(responses[0].data);
      setUsers(responses[1].data);
      setDepartments(responses[2].data);
      setTickets(responses[3].data);
      setAdminProfiles(responses[4].data);
      setCompanies(responses[5].data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-[#ED1B2F] selection:text-white relative overflow-hidden">
      <BackgroundScene />
      <LoadingScreen />
      <ErrorDisplay />
      <Header user={user} />
      <Navigation />
      <DashboardContent />
      <Modals />
    </div>
  );
};

export default SuperAdminDashboard;