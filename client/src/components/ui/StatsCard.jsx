import React from 'react';

const StatsCard = ({ title, value, color = 'white', icon: Icon }) => {
  const colorClasses = {
    white: 'text-white',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    red: 'text-[#ED1B2F]'
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
          <div className="text-sm text-white/60">{title}</div>
        </div>
        {Icon && <Icon className={`text-2xl ${colorClasses[color]} opacity-50`} />}
      </div>
    </div>
  );
};

export default StatsCard;