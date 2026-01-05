// components/ui/Badge.jsx
import React from 'react';

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    yellow: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    gray: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

export default Badge;