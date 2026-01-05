// components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../constants/theme';

/**
 * Main Card Component
 */

const Card = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  loading = false,
  padding = 'md',
  header = null,
  footer = null,
  backgroundColor,
  borderColor,
  shadow = true,
  shadowSize = 'md',
  animationDelay = 0,
  fullWidth = false,
  ...props
}) => {
  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-[#1E293B] border border-white/10',
    glass: 'backdrop-blur-xl bg-white/5 border border-white/10',
    gradient: `bg-gradient-to-br from-[${THEME.primary}]/10 to-[${THEME.secondary}]/10 border border-white/10`,
    bordered: 'bg-transparent border-2 border-[#ED1B2F]',
    flat: 'bg-white/5 border-none',
  };

  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: animationDelay,
        ease: "easeOut"
      }
    },
    hover: hoverable ? {
      scale: 1.02,
      borderColor: THEME.primary,
      transition: { duration: 0.2 }
    } : {},
    tap: clickable ? { scale: 0.98 } : {}
  };

  // Custom styles
  const customStyles = {};
  if (backgroundColor) customStyles.backgroundColor = backgroundColor;
  if (borderColor) customStyles.borderColor = borderColor;

  // Handle click
  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  // Loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="h-4 bg-white/10 rounded animate-pulse"></div>
      <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
    </div>
  );

  // Render header
  const renderHeader = () => {
    if (!header) return null;
    
    if (typeof header === 'string') {
      return (
        <div className="border-b border-white/10 pb-4 mb-6">
          <h3 className="text-xl font-bold text-white">{header}</h3>
        </div>
      );
    }
    
    if (header.title || header.children) {
      return (
        <div className={`border-b border-white/10 pb-4 mb-6 ${header.className || ''}`}>
          {header.title && (
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{header.title}</h3>
              {header.actions && (
                <div className="flex items-center gap-2">
                  {header.actions}
                </div>
              )}
            </div>
          )}
          {header.subtitle && (
            <p className="text-sm text-white/60 mt-1">{header.subtitle}</p>
          )}
          {header.children && <div className="mt-2">{header.children}</div>}
        </div>
      );
    }
    
    return header;
  };

  // Render footer
  const renderFooter = () => {
    if (!footer) return null;
    
    if (typeof footer === 'string') {
      return (
        <div className="border-t border-white/10 pt-4 mt-6">
          <p className="text-sm text-white/60">{footer}</p>
        </div>
      );
    }
    
    if (footer.children || footer.text) {
      return (
        <div className={`border-t border-white/10 pt-4 mt-6 ${footer.className || ''}`}>
          {footer.text && <p className="text-sm text-white/60">{footer.text}</p>}
          {footer.children && <div className="mt-2">{footer.children}</div>}
          {footer.actions && (
            <div className="flex justify-end gap-2 mt-3">
              {footer.actions}
            </div>
          )}
        </div>
      );
    }
    
    return footer;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      variants={cardVariants}
      onClick={handleClick}
      className={`
        relative
        rounded-2xl
        ${variantClasses[variant]}
        ${hoverable ? 'cursor-pointer transition-all duration-200 hover:border-[#ED1B2F]' : ''}
        ${clickable ? 'cursor-pointer select-none active:scale-[0.99]' : ''}
        ${paddingClasses[padding]}
        ${shadow ? shadowClasses[shadowSize] : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={customStyles}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#ED1B2F] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white mt-2 text-sm">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Gradient border effect */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ED1B2F] to-[#455185] opacity-10 -z-10"></div>
      )}
      
      {/* Content */}
      {renderHeader()}
      
      <div className={loading ? 'opacity-50' : ''}>
        {loading ? renderSkeleton() : children}
      </div>
      
      {renderFooter()}
    </motion.div>
  );
};

/**
 * CardTitle Component (for use inside Card)
 * Use this component for card titles
 */
const CardTitle = ({ children, className = '', size = 'lg', ...props }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };
  
  return (
    <h3 className={`${sizeClasses[size]} font-bold text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * CardSubtitle Component (for use inside Card)
 * Use this component for card subtitles
 */
const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-white/60 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

/**
 * CardContent Component (for use inside Card)
 * Use this component for card content sections
 */
const CardContent = ({ children, className = '', padding = 'md', ...props }) => {
  const paddingClasses = {
    none: 'py-0',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
  };
  
  return (
    <div className={`${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardActions Component (for use inside Card)
 * Use this component for action buttons in cards
 */
const CardActions = ({ children, className = '', align = 'end', ...props }) => {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };
  
  return (
    <div className={`flex gap-2 ${alignClasses[align]} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardStat Component - Special card for dashboard statistics
 */
const CardStat = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className = '',
  color = 'primary',
  loading = false 
}) => {
  const colorClasses = {
    primary: `from-[${THEME.primary}] to-red-700`,
    secondary: `from-[${THEME.secondary}] to-blue-900`,
    success: `from-[${THEME.success}] to-emerald-700`,
    warning: `from-[${THEME.warning}] to-amber-700`,
    danger: `from-[${THEME.danger}] to-red-700`,
    info: `from-[${THEME.info}] to-blue-700`,
  };
  
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-white/60',
  };
  
  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };
  
  return (
    <Card variant="glass" hoverable className={className}>
      <div className="relative">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-20 rounded-2xl -z-10`}></div>
        
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider">{title}</p>
            {loading ? (
              <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse mt-2"></div>
            ) : (
              <h3 className="text-4xl font-black text-white mt-2">{value}</h3>
            )}
            
            {trend && !loading && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trendColors[trend]}`}>
                <span>{trendIcons[trend]}</span>
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`text-4xl opacity-80 ${colorClasses[color].includes('primary') ? 'text-[#ED1B2F]' : ''}`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-1000`}></div>
        </div>
      </div>
    </Card>
  );
};

/**
 * CardGrid Component - For laying out cards in a grid
 */
const CardGrid = ({ children, columns = 3, gap = 6, className = '' }) => {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  };
  
  const gridGap = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  return (
    <div className={`grid ${gridColumns[columns]} ${gridGap[gap]} ${className}`}>
      {children}
    </div>
  );
};

/**
 * CardWithImage Component - Card with image header
 */
const CardWithImage = ({ 
  imageUrl, 
  imageAlt, 
  imageHeight = 'h-48',
  overlay = false,
  overlayOpacity = 50,
  children,
  ...cardProps 
}) => (
  <Card {...cardProps} className={`overflow-hidden ${cardProps.className || ''}`}>
    {imageUrl && (
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={imageAlt || ''} 
          className={`w-full ${imageHeight} object-cover rounded-t-2xl`}
        />
        {overlay && (
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
            style={{ opacity: overlayOpacity / 100 }}
          ></div>
        )}
      </div>
    )}
    <div className={imageUrl ? 'pt-6' : ''}>
      {children}
    </div>
  </Card>
);

// Export everything as a single object to avoid naming conflicts
const CardComponents = {
  // Main Card component (default)
  Card,
  
  // Helper components (attach to Card as properties)
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Content: CardContent,
  Actions: CardActions,
  
  // Special card types
  Stat: CardStat,
  Grid: CardGrid,
  WithImage: CardWithImage,
};

// Set the helper components as properties of the main Card
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.Stat = CardStat;
Card.Grid = CardGrid;
Card.WithImage = CardWithImage;

// Export the main Card component with attached helpers
export default Card;

// Also export the object for destructuring if needed
export { CardComponents };

// Individual exports with unique names (prefixed with Card)
export {
  CardTitle as UICardTitle,
  CardSubtitle as UICardSubtitle,
  CardContent as UICardContent,
  CardActions as UICardActions,
  CardStat as UICardStat,
  CardGrid as UICardGrid,
  CardWithImage as UICardWithImage,
};