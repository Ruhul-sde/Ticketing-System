import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', fullPage = false }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ED1B2F] mb-6"></div>
      <p className="text-white text-lg mb-2">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-6 overflow-hidden">
        <div className="flex flex-col items-center justify-center h-96">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;