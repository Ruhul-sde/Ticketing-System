import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  loading = false,
  shimmer = false,
  rounded = 'xl',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none relative overflow-hidden';
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-[#ED1B2F] via-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 active:shadow-red-500/40 focus:ring-2 focus:ring-red-500/50',
    secondary: 'bg-white/5 backdrop-blur-sm text-white border border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-2 focus:ring-white/20',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 focus:ring-2 focus:ring-red-500/50',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/5 focus:ring-2 focus:ring-white/20',
    success: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 focus:ring-2 focus:ring-emerald-500/50',
    warning: 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/25 focus:ring-2 focus:ring-amber-500/50',
    premium: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:shadow-lg hover:shadow-purple-500/30 focus:ring-2 focus:ring-purple-500/50 animate-gradient',
    glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30 focus:ring-2 focus:ring-white/30 shadow-lg'
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3.5 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const isDisabled = disabled || loading;

  // Shimmer effect animation
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <motion.button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${widthClass}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer transform hover:scale-105 active:scale-100'}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {/* Shimmer effect overlay */}
      {shimmer && !isDisabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Button content with icon */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <LoadingSpinner />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="text-current">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="text-current">{icon}</span>
            )}
          </>
        )}
      </span>

      {/* Hover glow effect */}
      {!isDisabled && (
        <motion.div
          className="absolute inset-0 bg-white/0 rounded-inherit"
          whileHover={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            transition: { duration: 0.2 }
          }}
        />
      )}
    </motion.button>
  );
};

export default Button;