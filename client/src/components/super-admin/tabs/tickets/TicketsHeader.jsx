// tickets/TicketsHeader.jsx
import React from 'react';
import Button from '../../../ui/Button';
import { FaTicketAlt, FaPlus, FaFilter } from 'react-icons/fa';

const TicketsHeader = ({ stats, filteredCount, onCreateClick, onRefresh, loading }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div>
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <FaTicketAlt className="text-[#ED1B2F]" />
          Support Tickets
        </h3>
        <p className="text-sm text-white/60 mt-1">
          {filteredCount} of {stats.totalTickets} tickets • {stats.openTickets} open • {stats.inProgressTickets} in progress
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="primary" 
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <FaPlus />
          New Ticket
        </Button>
        <Button 
          variant="secondary" 
          onClick={onRefresh}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaFilter className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default TicketsHeader;