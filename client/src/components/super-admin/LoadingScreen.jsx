// components/super-admin/LoadingScreen.jsx
import React from 'react';
import { useSuperAdmin } from '../../context/SuperAdminContext';

const LoadingScreen = () => {
  const { loading } = useSuperAdmin();
  
  if (!loading) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a] flex items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[#ED1B2F] rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-2 border-4 border-t-[#455185] border-r-[#ED1B2F] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;