// tickets/TicketFilters.jsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const TicketFilters = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  companies, 
  departments, 
  statuses, 
  priorities 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="md:col-span-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tickets by title, ticket number, or description..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
        </div>
      </div>
      
      <div>
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent appearance-none"
          value={filters.company}
          onChange={(e) => onFilterChange({...filters, company: e.target.value})}
        >
          <option value="all" className="bg-gray-900 text-white">All Companies</option>
          {companies.map(company => (
            <option 
              key={company._id} 
              value={company._id}
              className="bg-gray-900 text-white"
            >
              {company.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent appearance-none"
          value={filters.department}
          onChange={(e) => onFilterChange({...filters, department: e.target.value})}
        >
          <option value="all" className="bg-gray-900 text-white">All Departments</option>
          {departments.map(dept => (
            <option 
              key={dept._id} 
              value={dept._id}
              className="bg-gray-900 text-white"
            >
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent appearance-none"
          value={filters.status}
          onChange={(e) => onFilterChange({...filters, status: e.target.value})}
        >
          <option value="all" className="bg-gray-900 text-white">All Status</option>
          {statuses.map(status => (
            <option 
              key={status} 
              value={status}
              className="bg-gray-900 text-white"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent appearance-none"
          value={filters.priority}
          onChange={(e) => onFilterChange({...filters, priority: e.target.value})}
        >
          <option value="all" className="bg-gray-900 text-white">All Priorities</option>
          {priorities.map(priority => (
            <option 
              key={priority} 
              value={priority}
              className="bg-gray-900 text-white"
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TicketFilters;