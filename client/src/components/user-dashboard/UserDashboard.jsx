// components/user-dashboard/UserDashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserDashboard } from '../../context/UserDashboardContext';
import InteractiveHeader from './InteractiveHeader';
import UserDashboardContent from './UserDashboardContent';
import TicketDetailModal from './TicketDetailModal';
// Remove ErrorDisplay and LoadingScreen imports for now

const UserDashboard = () => {
  const { user } = useAuth();
  const { 
    fetchDashboardData, 
    loading, 
    error,
    isModalOpen,
    closeTicketModal,
    activeTicket
  } = useUserDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-[#ED1B2F] rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 border-4 border-t-[#455185] border-r-[#ED1B2F] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Loading Support Dashboard</h3>
          <p className="text-white/60">Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-3">Unable to Load Dashboard</h3>
          <p className="text-white/70 mb-6">{error || 'An unknown error occurred'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-200 selection:bg-[#ED1B2F] selection:text-white pb-20 font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#ED1B2F]/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#455185]/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <InteractiveHeader user={user} />
        <UserDashboardContent user={user} />
      </div>

      {isModalOpen && activeTicket && (
        <TicketDetailModal 
          ticket={activeTicket} 
          onClose={closeTicketModal}
        />
      )}
    </div>
  );
};

export default UserDashboard;