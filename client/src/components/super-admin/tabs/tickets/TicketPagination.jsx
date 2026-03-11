// tickets/TicketPagination.jsx
import React from 'react';
import Button from '../../../ui/Button';

const TicketPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage, 
  startIndex, 
  endIndex 
}) => {
  return (
    <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
      <div className="text-sm text-white/60">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} tickets
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ← Previous
        </Button>
        
        <span className="text-white/70 px-3 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default TicketPagination;