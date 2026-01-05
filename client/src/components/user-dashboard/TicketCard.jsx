// components/user-dashboard/TicketCard.jsx
import React from 'react';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

const TicketCard = ({ ticket, onClick }) => {
  const statusStyles = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    assigned: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  const priorityColors = {
    low: 'text-blue-400',
    medium: 'text-amber-400',
    high: 'text-red-400'
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-slate-900/40 border border-white/10 rounded-[2rem] p-6 cursor-pointer hover:border-[#ED1B2F]/40 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <RocketLaunchIcon className="w-8 h-8 text-[#ED1B2F]" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyles[ticket.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
          {ticket.status}
        </span>
        <span className={`text-xs font-bold ${priorityColors[ticket.priority] || 'text-slate-400'}`}>
          {ticket.priority} priority
        </span>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#ED1B2F] transition-colors">
        {ticket.title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 mb-6">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="text-xs text-slate-500">
          {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-[#455185]">
            {ticket.department?.name || 'General'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;