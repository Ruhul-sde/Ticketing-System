// components/user-dashboard/ErrorDisplay.jsx
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0c14] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <ExclamationTriangleIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-white mb-3">Unable to Load Dashboard</h3>
        <p className="text-white/70 mb-6">{error || 'An unknown error occurred'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-[#ED1B2F] to-[#b01423] rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;