// tickets/TicketRow.jsx
import React from 'react';
import Badge from '../../../ui/Badge';
import Button from '../../../ui/Button';
import { getStatusColor, getPriorityColor } from '../../../../constants/theme';
import { FaBuilding, FaLayerGroup, FaPaperclip, FaCalendarAlt, FaTag, FaEye } from 'react-icons/fa';

const TicketRow = ({ ticket, onViewTicket }) => {
  const statusColor = getStatusColor(ticket.status);
  const priorityColor = getPriorityColor(ticket.priority);
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="p-4">
        <div 
          className="font-bold text-lg hover:text-[#ED1B2F] transition-colors cursor-pointer"
          onClick={() => onViewTicket(ticket)}
        >
          {ticket.title || 'Untitled Ticket'}
        </div>
        <div className="text-xs text-white/50 mt-1">
          #{ticket.ticketNumber || ticket._id?.slice(-6)} • 
          Created by: {ticket.createdBy?.name || 'Unknown'}
          {ticket.category && ` • ${ticket.category}`}
        </div>
        {ticket.description && (
          <div className="text-sm text-white/70 mt-2 line-clamp-2">
            {ticket.description.length > 100 
              ? `${ticket.description.substring(0, 100)}...` 
              : ticket.description}
          </div>
        )}
        {ticket.attachmentCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
            <FaPaperclip size={10} />
            {ticket.attachmentCount} attachment{ticket.attachmentCount !== 1 ? 's' : ''}
          </div>
        )}
      </td>
      
      <td className="p-4">
        <div className="space-y-2">
          {ticket.company && (
            <div className="flex items-center gap-2">
              <FaBuilding className="text-blue-400" size={14} />
              <span className="font-medium">{ticket.company.name || 'Unknown Company'}</span>
            </div>
          )}
          {ticket.department && (
            <div className="flex items-center gap-2">
              <FaLayerGroup className="text-purple-400" size={14} />
              <span className="text-sm text-white/70">{ticket.department.name}</span>
            </div>
          )}
        </div>
      </td>
      
      <td className="p-4">
        <div className="space-y-2">
          <Badge color={statusColor}>
            {ticket.status || 'pending'}
          </Badge>
          <Badge color={priorityColor}>
            {ticket.priority || 'medium'}
          </Badge>
          {ticket.category && (
            <div className="text-xs text-white/60 mt-1">
              <FaTag className="inline mr-1" size={10} />
              {ticket.category}
            </div>
          )}
        </div>
      </td>
      
      <td className="p-4">
        <div className="text-sm text-white/60">
          <FaCalendarAlt className="inline mr-1" size={12} />
          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown'}
        </div>
        {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
          <div className="text-xs text-white/40 mt-1">
            Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
          </div>
        )}
      </td>
      
      <td className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewTicket(ticket)}
          className="flex items-center gap-2"
        >
          <FaEye />
          View
        </Button>
      </td>
    </tr>
  );
};

export default TicketRow;