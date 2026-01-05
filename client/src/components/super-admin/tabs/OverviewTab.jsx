// components/super-admin/tabs/OverviewTab.jsx
import React, { useMemo } from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import StatsCards from './StatsCards';
import AnalyticsChart from './AnalyticsChart';
import { formatTime } from '../../../constants/theme';

const OverviewTab = () => {
  const { 
    tickets, departments, selectedTimeRange, setSelectedTimeRange 
  } = useSuperAdmin();

  const analytics = useMemo(() => {
    const now = new Date();
    const rangeMap = { 
      '24h': 86400000, 
      '7d': 604800000, 
      '30d': 2592000000, 
      'all': Infinity 
    };
    const cutoff = now - rangeMap[selectedTimeRange];
    
    const safeTickets = Array.isArray(tickets) ? tickets : [];
    const filtered = safeTickets.filter(t => new Date(t.createdAt) >= cutoff);

    // Time Series
    const days = {};
    filtered.forEach(t => {
      const d = new Date(t.createdAt).toLocaleDateString();
      if (!days[d]) days[d] = { date: d, created: 0, solved: 0 };
      days[d].created++;
      if (['resolved', 'solved'].includes(t.status)) days[d].solved++;
    });
    const timeSeriesData = Object.values(days).sort((a,b) => new Date(a.date) - new Date(b.date));

    // Department Performance
    const deptPerformance = departments.map(d => {
      const deptTickets = safeTickets.filter(t => 
        t.department?._id === d._id || t.department === d._id
      );
      const resolved = deptTickets.filter(t => 
        ['resolved', 'solved'].includes(t.status)
      );
      const avgTime = resolved.length 
        ? resolved.reduce((acc, t) => acc + (t.timeToSolve || 0), 0) / resolved.length 
        : 0;
      
      return {
        name: d.name,
        total: deptTickets.length,
        solved: resolved.length,
        efficiency: deptTickets.length 
          ? (resolved.length / deptTickets.length) * 100 
          : 0,
        avgTime
      };
    }).sort((a, b) => b.efficiency - a.efficiency);

    return { timeSeriesData, deptPerformance };
  }, [tickets, departments, selectedTimeRange]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <AnalyticsChart 
            timeSeriesData={analytics.timeSeriesData}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
          />
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-[#455185]">📊</span> Department Efficiency
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {analytics.deptPerformance.map((dept, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white font-medium truncate mr-2">
                    {dept.name}
                  </span>
                  <span className="text-emerald-400 font-bold whitespace-nowrap">
                    {dept.efficiency.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ED1B2F] to-[#455185] transition-all duration-1000"
                    style={{ width: `${Math.min(dept.efficiency, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-white/40 mt-1 flex justify-between">
                  <span className="truncate mr-2">
                    {dept.solved}/{dept.total} Solved
                  </span>
                  <span className="whitespace-nowrap">
                    Avg: {formatTime(dept.avgTime)}
                  </span>
                </div>
              </div>
            ))}
            
            {analytics.deptPerformance.length === 0 && (
              <div className="text-white/40 text-center py-4">
                No department data yet.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;