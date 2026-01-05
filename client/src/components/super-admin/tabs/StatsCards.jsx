// components/super-admin/tabs/StatsCards.jsx
import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import Card from '../../ui/Card';
import { formatTime } from '../../../constants/theme';

const StatsCards = () => {
  const { tickets } = useSuperAdmin();

  const stats = React.useMemo(() => {
    const totalTicketsCount = tickets.length;
    const resolvedCount = tickets.filter(t => 
      ['resolved', 'solved'].includes(t.status)
    ).length;
    const successRate = totalTicketsCount > 0 
      ? ((resolvedCount / totalTicketsCount) * 100).toFixed(1) 
      : 0;
    
    const resolvedTicketsWithTime = tickets.filter(t => 
      ['resolved', 'solved'].includes(t.status) && t.timeToSolve
    );
    const totalTime = resolvedTicketsWithTime.reduce((acc, t) => acc + t.timeToSolve, 0);
    const avgTimeMs = resolvedTicketsWithTime.length 
      ? totalTime / resolvedTicketsWithTime.length 
      : 0;

    const ratedTickets = tickets.filter(t => t.feedback?.rating);
    const avgRating = ratedTickets.length 
      ? (ratedTickets.reduce((acc, t) => acc + t.feedback.rating, 0) / ratedTickets.length).toFixed(1) 
      : 'N/A';

    const pendingCount = tickets.filter(t => 
      ['pending', 'open', 'in-progress'].includes(t.status)
    ).length;

    return {
      totalTicketsCount,
      successRate,
      avgTimeMs,
      avgRating,
      pendingCount,
      resolvedCount
    };
  }, [tickets]);

  const statCards = [
    { 
      label: 'Total Tickets', 
      value: stats.totalTicketsCount,
      icon: '🎫', 
      color: 'from-blue-600 to-blue-800',
      subtext: `${stats.resolvedCount} resolved`
    },
    { 
      label: 'Success Rate', 
      value: `${stats.successRate}%`,
      icon: '📈', 
      color: 'from-[#ED1B2F] to-red-800',
      subtext: 'Resolution rate'
    },
    { 
      label: 'Avg Resolution', 
      value: formatTime(stats.avgTimeMs),
      icon: '⚡', 
      color: 'from-[#455185] to-purple-800',
      subtext: 'Average time'
    },
    { 
      label: 'User Satisfaction', 
      value: stats.avgRating === 'N/A' ? 'N/A' : `${stats.avgRating}/5`, 
      icon: '⭐', 
      color: 'from-yellow-500 to-amber-700',
      subtext: 'Average rating'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((item, idx) => (
        <Card key={idx} className="overflow-hidden border-0 group hover:scale-105 transition-transform duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/60 text-sm font-medium uppercase tracking-wider">
                  {item.label}
                </p>
                <h3 className="text-4xl font-black text-white mt-2">
                  {item.value}
                </h3>
                {item.subtext && (
                  <p className="text-xs text-white/40 mt-1">
                    {item.subtext}
                  </p>
                )}
              </div>
              <span className="text-4xl opacity-80">{item.icon}</span>
            </div>
            <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${item.color} w-full`}></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;