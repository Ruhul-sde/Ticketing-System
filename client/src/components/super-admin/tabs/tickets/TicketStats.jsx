// tickets/TicketStats.jsx
import React from 'react';

const TicketStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
        <div className="text-2xl font-bold text-white">{stats.totalTickets}</div>
        <div className="text-sm text-white/60">Total Tickets</div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
        <div className="text-2xl font-bold text-yellow-400">{stats.openTickets}</div>
        <div className="text-sm text-white/60">Open</div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
        <div className="text-2xl font-bold text-blue-400">{stats.inProgressTickets}</div>
        <div className="text-sm text-white/60">In Progress</div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
        <div className="text-2xl font-bold text-emerald-400">{stats.resolvedTickets}</div>
        <div className="text-sm text-white/60">Resolved</div>
      </div>
    </div>
  );
};

export default TicketStats;