// tickets/TicketDetailModal.jsx
import React from 'react';
import Modal from '../../../ui/Modal';
import Badge from '../../../ui/Badge';
import Button from '../../../ui/Button';
import { getStatusColor, getPriorityColor } from '../../../../constants/theme';
import TicketAttachments from './TicketAttachments';
import {
  FaBuilding,
  FaLayerGroup,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaFileContract
} from 'react-icons/fa';

const TicketDetailModal = ({ isOpen, onClose, ticket, onTicketUpdated }) => {
  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ticket #${ticket.ticketNumber || ticket._id?.slice(-6)}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Ticket Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">{ticket.title}</h4>
            <div className="text-sm text-white/70">
              Created by: {ticket.createdBy?.name || 'Unknown'}
              {ticket.createdBy?.companyName && ` • ${ticket.createdBy.companyName}`}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge color={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge color={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            {ticket.category && (
              <Badge color="blue">{ticket.category}</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="font-bold text-white mb-2">Description</h5>
          <div className="bg-white/5 p-4 rounded-lg text-white/80 whitespace-pre-wrap">
            {ticket.description || 'No description provided.'}
          </div>
          {ticket.reason && (
            <div className="mt-2 text-sm text-white/60">
              <span className="font-medium">Reason:</span> {ticket.reason}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Company</h6>
            <div className="text-white flex items-center gap-2">
              <FaBuilding />
              {ticket.company?.name || ticket.createdBy?.companyName || 'No company'}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Department</h6>
            <div className="text-white flex items-center gap-2">
              <FaLayerGroup />
              {ticket.department?.name || 'No department'}
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <h6 className="font-bold text-white/70 text-sm mb-2">Created</h6>
            <div className="text-white flex items-center gap-2">
              <FaCalendarAlt />
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <TicketAttachments 
          ticket={ticket} 
          onTicketUpdated={onTicketUpdated} 
        />

        {/* Time Tracking */}
        {ticket.timeToSolve && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h5 className="font-bold text-white mb-2">Time to Resolution</h5>
            <div className="text-white flex items-center gap-2">
              <FaClock />
              {Math.round(ticket.timeToSolve / 60000)} minutes
            </div>
          </div>
        )}

        {/* Solution */}
        {ticket.solution && (
          <div>
            <h5 className="font-bold text-white mb-2">Solution</h5>
            <div className="bg-white/5 p-4 rounded-lg text-white/80">
              {ticket.solution}
            </div>
          </div>
        )}

        {/* Feedback */}
        {ticket.feedback && (
          <div className="bg-white/5 p-4 rounded-lg">
            <h5 className="font-bold text-white mb-2">User Feedback</h5>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                {ticket.feedback.rating >= 4 ? (
                  <FaCheckCircle className="text-emerald-400" />
                ) : ticket.feedback.rating >= 3 ? (
                  <FaExclamationTriangle className="text-yellow-400" />
                ) : (
                  <FaTimesCircle className="text-red-400" />
                )}
                <span className="font-medium">Rating: {ticket.feedback.rating}/5</span>
              </div>
              {ticket.feedback.comment && (
                <div className="text-white/70 text-sm mt-2 p-3 bg-black/20 rounded">
                  "{ticket.feedback.comment}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default TicketDetailModal;