// tickets/TicketTable.jsx
import React from 'react';
import TicketRow from './TicketRow';
import EmptyTicketState from './EmptyTicketState';

const TicketTable = ({ tickets, onViewTicket, onClearFilters, onCreateClick }) => {
  if (tickets.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4">Ticket Details</th>
              <th className="p-4">Company & Department</th>
              <th className="p-4">Status & Priority</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <EmptyTicketState 
              onClearFilters={onClearFilters} 
              onCreateClick={onCreateClick} 
            />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
            <th className="p-4">Ticket Details</th>
            <th className="p-4">Company & Department</th>
            <th className="p-4">Status & Priority</th>
            <th className="p-4">Created</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {tickets.map(ticket => (
            <TicketRow 
              key={ticket._id} 
              ticket={ticket} 
              onViewTicket={onViewTicket}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;