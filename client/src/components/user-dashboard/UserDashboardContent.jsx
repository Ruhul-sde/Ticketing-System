// components/user-dashboard/UserDashboardContent.jsx
import React, { useEffect } from 'react';
import { useUserDashboard } from '../../context/UserDashboardContext';
import TicketCreationForm from './TicketCreationForm';
import TicketCard from './TicketCard';
import UserActionBar from './UserActionBar';
import { 
  ChatBubbleBottomCenterTextIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const UserDashboardContent = ({ user }) => {
  const { 
    supportTickets, 
    isCreatingTicket,
    openTicketModal,
    loading,
    error,
    fetchDashboardData
  } = useUserDashboard();

  // Debug: Log when component renders and what data it has
  useEffect(() => {
    console.log('UserDashboardContent rendered:', {
      hasUser: !!user,
      ticketsCount: supportTickets.length,
      loading,
      error: error ? error.substring(0, 100) : 'none'
    });
  }, [user, supportTickets.length, loading, error]);

  // Show loading state within content
  if (loading) {
    return (
      <>
        <UserActionBar user={user} />
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">My Support Tickets</h3>
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4 animate-spin text-white/60" />
              <span className="text-sm text-white/50">Loading...</span>
            </div>
          </div>
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="bg-white/5 p-6 rounded-2xl border border-white/10 animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3 mb-6"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-white/10 rounded w-16"></div>
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Show error state within content
  if (error) {
    return (
      <>
        <UserActionBar user={user} />
        <div className="mb-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Failed to Load Tickets</h3>
                <p className="text-red-200/80 text-sm">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserActionBar user={user} />

      {isCreatingTicket && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <TicketCreationForm />
        </div>
      )}

      {/* Tickets Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-white">My Support Tickets</h3>
            <button
              onClick={fetchDashboardData}
              className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh tickets"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-white/50">
            {supportTickets.length} ticket{supportTickets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {supportTickets.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <ChatBubbleBottomCenterTextIcon className="w-20 h-20 mx-auto mb-4 text-white/20" />
            <p className="text-xl text-white/60 mb-2">No tickets yet</p>
            <p className="text-white/40">Create your first support ticket to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportTickets.map((ticket) => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onClick={() => openTicketModal(ticket)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats - Only show if there are tickets */}
      {supportTickets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-sm text-white/60 mb-2">Open Tickets</div>
            <div className="text-3xl font-bold text-white">
              {supportTickets.filter(t => t.status !== 'resolved').length}
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-sm text-white/60 mb-2">Resolved</div>
            <div className="text-3xl font-bold text-emerald-400">
              {supportTickets.filter(t => t.status === 'resolved').length}
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-sm text-white/60 mb-2">Avg. Response Time</div>
            <div className="text-3xl font-bold text-[#455185]">
              {supportTickets.length > 0 ? '24h' : 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-black/20 rounded-lg border border-white/10">
          <p className="text-xs text-white/40 mb-1">Debug Info:</p>
          <p className="text-xs text-white/60">
            User: {user?.email} | Tickets: {supportTickets.length} | 
            Last fetch: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </>
  );
};

export default UserDashboardContent;