// components/super-admin/ErrorDisplay.jsx
import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';

const ErrorDisplay = () => {
  const { error, loading } = useSuperAdmin();
  
  if (!error || loading) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl p-4 max-w-md backdrop-blur-sm">
      <div className="font-bold mb-1">Error</div>
      <div className="text-sm">{error}</div>
    </div>
  );
};

export default ErrorDisplay;