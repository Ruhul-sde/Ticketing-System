// components/ui/Button.jsx
import React from 'react';
import { THEME } from '../../constants/theme';

const Button = ({ onClick, variant = 'primary', children, className = "", type="button" }) => {
  const baseClass = "px-6 py-2.5 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2";
  const variants = {
    primary: `bg-gradient-to-r from-[${THEME.primary}] to-red-700 text-white hover:shadow-red-500/25`,
    secondary: `bg-gradient-to-r from-[${THEME.secondary}] to-blue-900 text-white hover:shadow-blue-500/25`,
    ghost: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;