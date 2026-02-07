// components/user-dashboard/TicketCard.jsx
import React, { useState } from 'react';
import { RocketLaunchIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TicketCard = ({ ticket, onClick, onEdit, onDelete, showActions = false, userRole = 'user' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    high: 'text-red-400',
    urgent: 'text-red-500'
  };

  const canEdit = () => {
    if (userRole === 'superadmin') return true;
    if (userRole === 'admin') {
      // Admin can only edit tickets from their department
      return ticket.department?._id === userDepartment?._id;
    }
    // User can only edit their own pending tickets
    return ticket.status === 'pending';
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(ticket);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      if (showDeleteConfirm) {
        onDelete(ticket);
        setShowDeleteConfirm(false);
      } else {
        setShowDeleteConfirm(true);
        setTimeout(() => setShowDeleteConfirm(false), 3000);
      }
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDeleteConfirm(false);
      }}
      className="group relative bg-slate-900/40 border border-white/10 rounded-[2rem] p-6 cursor-pointer hover:border-[#ED1B2F]/40 hover:bg-slate-900/60 transition-all duration-300 overflow-hidden"
    >
      {/* Edit/Delete Actions */}
      {(showActions && isHovered) && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {canEdit() && (
            <button
              onClick={handleEditClick}
              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-full transition-colors"
              title="Edit Ticket"
            >
              <PencilIcon className="w-4 h-4 text-blue-400" />
            </button>
          )}
          
          {(userRole === 'superadmin' || (userRole === 'admin' && ticket.status === 'pending')) && (
            <button
              onClick={handleDeleteClick}
              className={`p-2 ${showDeleteConfirm ? 'bg-red-500/40' : 'bg-red-500/20 hover:bg-red-500/40'} rounded-full transition-colors`}
              title={showDeleteConfirm ? 'Click again to confirm delete' : 'Delete Ticket'}
            >
              <TrashIcon className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      )}

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

      {/* Category and Reason if exists */}
      {(ticket.category || ticket.reason) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ticket.category && (
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
              {ticket.category}
            </span>
          )}
          {ticket.reason && (
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full">
              {ticket.reason}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>
            {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {ticket.updatedAt !== ticket.createdAt && (
            <span className="text-[10px] bg-slate-700/50 px-2 py-0.5 rounded">
              Edited {getTimeAgo(ticket.updatedAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-[#455185]">
            {ticket.department?.name || 'General'}
          </span>
          {ticket.createdOnBehalf && (
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
              On Behalf
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;