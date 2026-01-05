// components/super-admin/tabs/AnalyticsChart.jsx
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import Button from '../../ui/Button';

const AnalyticsChart = ({ 
  timeSeriesData, 
  selectedTimeRange, 
  setSelectedTimeRange 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-[#ED1B2F]">📊</span> Ticket Volume Analytics
        </h3>
        <div className="flex gap-2">
          {['24h', '7d', '30d', 'all'].map(range => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedTimeRange === range 
                  ? 'bg-[#ED1B2F] text-white' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px]">
        {timeSeriesData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ED1B2F" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ED1B2F" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#455185" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#455185" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                stroke="#ffffff60" 
                tick={{fill: '#ffffff60', fontSize: 12}}
              />
              <YAxis 
                stroke="#ffffff60" 
                tick={{fill: '#ffffff60', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  border: '1px solid #334155', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
                formatter={(value) => [value, 'Tickets']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="created" 
                stroke="#ED1B2F" 
                fillOpacity={1} 
                fill="url(#colorCreated)" 
                name="Created"
              />
              <Area 
                type="monotone" 
                dataKey="solved" 
                stroke="#455185" 
                fillOpacity={1} 
                fill="url(#colorSolved)" 
                name="Solved"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-white/40">
            <div className="text-4xl mb-2">📈</div>
            <p>No data available for the selected time range</p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => setSelectedTimeRange('all')}
            >
              View All Data
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsChart;