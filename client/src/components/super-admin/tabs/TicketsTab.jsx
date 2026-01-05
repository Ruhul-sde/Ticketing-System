// components/super-admin/tabs/TicketsTab.jsx
import React, { useState } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { getStatusColor, getPriorityColor } from '../../../constants/theme';

const TicketsTab = () => {
  const { 
    tickets, 
    searchQuery, 
    setSearchQuery,
    filters,
    setFilters,
    toggleModal,
    setSelections
  } = useSuperAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber?.toString().includes(searchQuery) ||
      ticket.createdBy?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = filters.department === 'all' || 
      ticket.department?._id === filters.department ||
      ticket.department === filters.department;
    
    const matchesStatus = filters.status === 'all' || 
      ticket.status === filters.status;
    
    const matchesPriority = filters.priority === 'all' || 
      ticket.priority === filters.priority;
    
    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Get unique values for filters
  const departments = [...new Set(tickets.map(t => t.department?.name).filter(Boolean))];
  const statuses = [...new Set(tickets.map(t => t.status).filter(Boolean))];
  const priorities = [...new Set(tickets.map(t => t.priority).filter(Boolean))];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-bold text-white">Support Tickets</h3>
        <div className="flex gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#ED1B2F] flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="primary" 
            onClick={() => toggleModal('createToken')}
          >
            + New Ticket
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white/5 rounded-xl">
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          value={filters.department}
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="all">All Priorities</option>
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <Button 
          variant="ghost" 
          className="text-sm"
          onClick={() => setFilters({ department: 'all', status: 'all', priority: 'all' })}
        >
          Clear Filters
        </Button>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
              <th className="p-4">Ticket Info</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {currentTickets.map(ticket => (
              <tr key={ticket._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-lg group-hover:text-[#ED1B2F] transition-colors">
                    {ticket.title}
                  </div>
                  <div className="text-xs text-white/50">
                    #{ticket.ticketNumber || ticket._id?.slice(-6)} • by {ticket.createdBy?.name || 'Unknown'}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {ticket.department?.name || 'N/A'}
                </td>
                <td className="p-4">
                  <Badge color={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge color={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-white/60">
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-4">
                  <Button 
                    variant="ghost" 
                    className="px-3 py-1 text-sm" 
                    onClick={() => {
                      setSelections(prev => ({...prev, ticket}));
                      toggleModal('tokenDetail');
                    }}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {currentTickets.length === 0 && (
          <div className="text-center text-white/40 py-10">
            No tickets found matching your criteria
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <Button
            variant="ghost"
            className="px-3 py-1 text-sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          
          <span className="text-white/60 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="ghost"
            className="px-3 py-1 text-sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TicketsTab;