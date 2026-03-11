import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent ${className}`}
        value={value}
        onChange={onChange}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
    </div>
  );
};

export default SearchInput;