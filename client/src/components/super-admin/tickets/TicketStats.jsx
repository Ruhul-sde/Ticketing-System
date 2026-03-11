import React from 'react';
import StatsCard from '../../ui/StatsCard';
import { FaTicketAlt, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const TicketStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Tickets"
        value={stats.totalTickets}
        color="white"
        icon={FaTicketAlt}
      />
      
      <StatsCard
        title="Open"
        value={stats.openTickets}
        color="yellow"
        icon={FaClock}
      />
      
      <StatsCard
        title="In Progress"
        value={stats.inProgressTickets}
        color="blue"
        icon={FaSpinner}
      />
      
      <StatsCard
        title="Resolved"
        value={stats.resolvedTickets}
        color="emerald"
        icon={FaCheckCircle}
      />
    </div>
  );
};

export default TicketStats;