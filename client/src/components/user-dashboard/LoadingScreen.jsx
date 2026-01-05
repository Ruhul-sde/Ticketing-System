// components/user-dashboard/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0c14] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-[#ED1B2F] rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-2 border-4 border-t-[#455185] border-r-[#ED1B2F] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Loading Support Dashboard</h3>
        <p className="text-white/60">Preparing your workspace...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;