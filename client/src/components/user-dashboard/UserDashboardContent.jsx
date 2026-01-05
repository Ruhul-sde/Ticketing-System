// components/user-dashboard/UserDashboardContent.jsx
import React from 'react';
import { useUserDashboard } from '../../context/UserDashboardContext';
import TicketCreationForm from './TicketCreationForm';
import TicketCard from './TicketCard';
import UserActionBar from './UserActionBar';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const UserDashboardContent = ({ user }) => {
  const { 
    supportTickets, 
    isCreatingTicket,
    openTicketModal 
  } = useUserDashboard();

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
          <h3 className="text-2xl font-bold text-white">My Support Tickets</h3>
          <span className="text-sm text-white/50">
            {supportTickets.length} ticket{supportTickets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {supportTickets.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30">
            <ChatBubbleBottomCenterTextIcon className="w-20 h-20 mx-auto mb-4" />
            <p className="text-xl italic">No tickets found.</p>
            <p className="text-white/60 mt-2">Create your first support ticket to get started!</p>
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

      {/* Quick Stats */}
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
    </>
  );
};

export default UserDashboardContent;