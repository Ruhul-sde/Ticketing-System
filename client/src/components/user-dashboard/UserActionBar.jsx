// components/user-dashboard/UserActionBar.jsx
import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUserDashboard } from '../../context/UserDashboardContext';

const UserActionBar = ({ user }) => {
  const { isCreatingTicket, setIsCreatingTicket } = useUserDashboard();

  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-12">
      <div>
        <h2 className="text-white/50 uppercase tracking-[0.3em] text-xs font-bold mb-1">Authenticated as</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ED1B2F] to-[#455185] flex items-center justify-center font-bold text-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <span className="text-2xl font-semibold text-white">{user?.name}</span>
            <p className="text-sm text-white/60">{user?.email}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsCreatingTicket(!isCreatingTicket)}
        className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl ${
          isCreatingTicket 
            ? 'bg-slate-800 text-white border border-white/10' 
            : 'bg-gradient-to-r from-[#ED1B2F] to-[#b01423] text-white hover:scale-105 active:scale-95'
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {isCreatingTicket ? <XMarkIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
          {isCreatingTicket ? 'Discard Draft' : 'Create New Ticket'}
        </span>
        {!isCreatingTicket && (
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};

export default UserActionBar;