// components/super-admin/modals/TicketDetailModal.jsx
import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import Badge from '../../ui/Badge';
import { getStatusColor, getPriorityColor } from '../../../constants/theme';

const TicketDetailModal = () => {
  const { selections } = useSuperAdmin();
  const ticket = selections.ticket;

  if (!ticket) return null;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xl font-bold mb-2">{ticket.title}</h4>
        <p className="text-white/60 mb-4">{ticket.description}</p>
      </div>

      <div className="bg-black/20 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/50">Status: </span>
            <Badge color={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
          
          <div>
            <span className="text-white/50">Priority: </span>
            <Badge color={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
          
          <div>
            <span className="text-white/50">Department: </span>
            <span className="text-white">{ticket.department?.name || 'N/A'}</span>
          </div>
          
          <div>
            <span className="text-white/50">Created By: </span>
            <span className="text-white">{ticket.createdBy?.name || 'Unknown'}</span>
          </div>
          
          <div className="col-span-2">
            <span className="text-white/50">Ticket Number: </span>
            <span className="text-white">#{ticket.ticketNumber || ticket._id?.slice(-6) || 'N/A'}</span>
          </div>
          
          {ticket.createdAt && (
            <div className="col-span-2">
              <span className="text-white/50">Created At: </span>
              <span className="text-white">
                {new Date(ticket.createdAt).toLocaleDateString()} at{' '}
                {new Date(ticket.createdAt).toLocaleTimeString()}
              </span>
            </div>
          )}
          
          {ticket.updatedAt && (
            <div className="col-span-2">
              <span className="text-white/50">Last Updated: </span>
              <span className="text-white">
                {new Date(ticket.updatedAt).toLocaleDateString()} at{' '}
                {new Date(ticket.updatedAt).toLocaleTimeString()}
              </span>
            </div>
          )}
          
          {ticket.timeToSolve && (
            <div>
              <span className="text-white/50">Time to Solve: </span>
              <span className="text-white">
                {Math.floor(ticket.timeToSolve / 60000)} minutes
              </span>
            </div>
          )}
          
          {ticket.feedback?.rating && (
            <div>
              <span className="text-white/50">Rating: </span>
              <span className="text-yellow-400">
                {ticket.feedback.rating}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {ticket.comments?.length > 0 && (
        <div>
          <h5 className="font-bold mb-2">Comments</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {ticket.comments.map((comment, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">{comment.author?.name}</span>
                  <span className="text-xs text-white/50">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailModal;