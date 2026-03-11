import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  disabled = false,
  className = '',
  label,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-2">
          {label} {required && <span className="text-[#ED1B2F]">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ED1B2F] focus:border-transparent appearance-none ${className} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.05)'
          }}
          {...props}
        >
          <option value="" className="bg-gray-900 text-white">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-gray-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default Dropdown;