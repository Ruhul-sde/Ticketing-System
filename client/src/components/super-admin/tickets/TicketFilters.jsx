import React from 'react';
import SearchInput from '../../ui/SearchInput';
import Dropdown from '../../ui/Dropdown';

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
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets by title, ticket number, or description..."
        />
      </div>
      
      <Dropdown
        options={[
          { value: 'all', label: 'All Companies' },
          ...companies.map(c => ({ value: c._id, label: c.name }))
        ]}
        value={filters.company}
        onChange={(e) => onFilterChange({ ...filters, company: e.target.value })}
        placeholder="All Companies"
      />
      
      <Dropdown
        options={[
          { value: 'all', label: 'All Departments' },
          ...departments.map(d => ({ value: d._id, label: d.name }))
        ]}
        value={filters.department}
        onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
        placeholder="All Departments"
      />
      
      <div className="grid grid-cols-2 gap-3">
        <Dropdown
          options={[
            { value: 'all', label: 'All Status' },
            ...statuses.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
          ]}
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          placeholder="All Status"
        />
        
        <Dropdown
          options={[
            { value: 'all', label: 'All Priorities' },
            ...priorities.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))
          ]}
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          placeholder="All Priorities"
        />
      </div>
    </div>
  );
};

export default TicketFilters;