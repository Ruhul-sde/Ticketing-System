// tickets/EmptyTicketState.jsx
import React from 'react';
import Button from '../../../ui/Button';
import { FaPlus } from 'react-icons/fa';

const EmptyTicketState = ({ onClearFilters, onCreateClick }) => {
  return (
    <tr>
      <td colSpan="5" className="p-8 text-center text-white/40">
        <div className="text-6xl mb-4">🎫</div>
        <p className="text-xl mb-2">No tickets found</p>
        <p className="text-white/60 mb-4">
          Try adjusting your filters or create a new ticket
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClearFilters}>
            Clear Filters
          </Button>
          <Button variant="primary" onClick={onCreateClick}>
            <FaPlus className="mr-2" />
            New Ticket
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default EmptyTicketState;