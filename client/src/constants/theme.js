// constants/theme.js

// ============================================
// THEME COLORS & CONSTANTS
// ============================================

export const THEME = {
  // Primary Colors
  primary: '#ED1B2F',       // Red
  secondary: '#455185',     // Dark Blue/Purple
  accent: '#8B5CF6',        // Purple
  success: '#10B981',       // Emerald
  warning: '#F59E0B',       // Amber
  danger: '#EF4444',        // Red (different from primary)
  info: '#3B82F6',         // Blue
  
  // Background Colors
  dark: '#0F172A',         // Dark background
  darker: '#020617',       // Even darker
  light: '#F8FAFC',        // Light background
  card: '#1E293B',         // Card background
  
  // Glass Effects
  glass: 'rgba(255, 255, 255, 0.05)',
  glassDark: 'rgba(0, 0, 0, 0.2)',
  glassLight: 'rgba(255, 255, 255, 0.1)',
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    muted: '#64748B',
    inverted: '#0F172A',
  },
  
  // Border Colors
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #ED1B2F 0%, #B91C1C 100%)',
    secondary: 'linear-gradient(135deg, #455185 0%, #3730A3 100%)',
    accent: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  }
};

// ============================================
// SPACING & SIZING
// ============================================

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const SIZES = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
};

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// ============================================
// ANIMATION & TRANSITIONS
// ============================================

export const ANIMATION = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easings: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================
// SHADOWS
// ============================================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: {
    primary: '0 0 20px rgba(237, 27, 47, 0.5)',
    secondary: '0 0 20px rgba(69, 81, 133, 0.5)',
    success: '0 0 20px rgba(16, 185, 129, 0.5)',
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format milliseconds to human readable time
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTime = (ms) => {
  if (!ms || ms < 0) return '0m';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

/**
 * Get color for priority badges
 * @param {string} priority - Priority level
 * @returns {string} Color name for badge
 */
export const getPriorityColor = (priority) => {
  if (!priority) return 'gray';
  
  const priorityMap = {
    critical: 'red',
    high: 'red',
    medium: 'yellow',
    low: 'green',
    normal: 'blue',
  };
  
  return priorityMap[priority.toLowerCase()] || 'gray';
};

/**
 * Get color for status badges
 * @param {string} status - Status value
 * @returns {string} Color name for badge
 */
export const getStatusColor = (status) => {
  if (!status) return 'gray';
  
  const statusMap = {
    // Active/Positive statuses
    active: 'green',
    online: 'green',
    resolved: 'green',
    solved: 'green',
    completed: 'green',
    approved: 'green',
    success: 'green',
    
    // Pending/Intermediate statuses
    pending: 'yellow',
    'in-progress': 'yellow',
    processing: 'yellow',
    waiting: 'yellow',
    review: 'yellow',
    
    // Inactive/Negative statuses
    inactive: 'red',
    offline: 'red',
    suspended: 'red',
    closed: 'red',
    rejected: 'red',
    failed: 'red',
    error: 'red',
    frozen: 'red',
    
    // Neutral statuses
    draft: 'blue',
    new: 'blue',
    open: 'blue',
    default: 'gray',
  };
  
  return statusMap[status.toLowerCase()] || 'gray';
};

/**
 * Get gradient class based on type
 * @param {string} type - Gradient type
 * @returns {string} CSS gradient class
 */
export const getGradientClass = (type = 'primary') => {
  const gradientClasses = {
    primary: `bg-gradient-to-r from-[${THEME.primary}] to-red-700`,
    secondary: `bg-gradient-to-r from-[${THEME.secondary}] to-blue-900`,
    accent: `bg-gradient-to-r from-[${THEME.accent}] to-purple-900`,
    success: `bg-gradient-to-r from-[${THEME.success}] to-emerald-700`,
    warning: `bg-gradient-to-r from-[${THEME.warning}] to-amber-700`,
    danger: `bg-gradient-to-r from-[${THEME.danger}] to-red-700`,
    dark: `bg-gradient-to-r from-[${THEME.dark}] to-slate-900`,
  };
  
  return gradientClasses[type] || gradientClasses.primary;
};

/**
 * Get background color with opacity
 * @param {string} color - Base color
 * @param {number} opacity - Opacity (0-1)
 * @returns {string} RGBA color string
 */
export const withOpacity = (color, opacity = 0.1) => {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get status badge text
 * @param {string} status - Status value
 * @returns {string} Formatted status text
 */
export const getStatusText = (status) => {
  if (!status) return 'Unknown';
  
  const textMap = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    resolved: 'Resolved',
    solved: 'Solved',
    closed: 'Closed',
    suspended: 'Suspended',
    frozen: 'Frozen',
    draft: 'Draft',
    new: 'New',
    open: 'Open',
    'in-progress': 'In Progress',
  };
  
  return textMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Get priority badge text
 * @param {string} priority - Priority value
 * @returns {string} Formatted priority text
 */
export const getPriorityText = (priority) => {
  if (!priority) return 'Normal';
  
  const textMap = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    normal: 'Normal',
  };
  
  return textMap[priority.toLowerCase()] || priority.charAt(0).toUpperCase() + priority.slice(1);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Calculate percentage with safety checks
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number} Calculated percentage
 */
export const calculatePercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return 0;
  const percentage = (value / total) * 100;
  return parseFloat(percentage.toFixed(decimals));
};

/**
 * Generate random ID (for temporary items)
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ============================================
// COMPONENT-SPECIFIC STYLES
// ============================================

export const COMPONENT_STYLES = {
  card: {
    base: 'relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl',
    hover: 'hover:border-[#ED1B2F] hover:scale-[1.02] transition-all duration-300',
  },
  button: {
    base: 'px-6 py-2.5 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2',
    primary: `bg-gradient-to-r from-[${THEME.primary}] to-red-700 text-white hover:shadow-red-500/25`,
    secondary: `bg-gradient-to-r from-[${THEME.secondary}] to-blue-900 text-white hover:shadow-blue-500/25`,
    ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
    success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20',
  },
  badge: {
    base: 'px-3 py-1 rounded-full text-xs font-medium border',
    colors: {
      green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      red: 'bg-red-500/20 text-red-300 border-red-500/30',
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      yellow: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gray: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    },
  },
  input: {
    base: 'w-full bg-black/20 p-3 rounded-lg border border-white/10 focus:border-[#ED1B2F] focus:outline-none text-white placeholder:text-white/40 transition-colors',
    error: 'border-red-500 focus:border-red-500',
    success: 'border-emerald-500 focus:border-emerald-500',
  },
};

// ============================================
// CHART COLORS
// ============================================

export const CHART_COLORS = {
  primary: ['#ED1B2F', '#B91C1C', '#991B1B'],
  secondary: ['#455185', '#3730A3', '#312E81'],
  accent: ['#8B5CF6', '#7C3AED', '#6D28D9'],
  success: ['#10B981', '#059669', '#047857'],
  warning: ['#F59E0B', '#D97706', '#B45309'],
  danger: ['#EF4444', '#DC2626', '#B91C1C'],
  gray: ['#6B7280', '#4B5563', '#374151'],
  
  // For charts with multiple data series
  series: [
    '#ED1B2F', // Red
    '#455185', // Dark Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#06B6D4', // Cyan
  ],
};

// ============================================
// EXPORT ALL UTILITIES
// ============================================

export default {
  THEME,
  SPACING,
  SIZES,
  TYPOGRAPHY,
  ANIMATION,
  SHADOWS,
  COMPONENT_STYLES,
  CHART_COLORS,
  formatTime,
  getPriorityColor,
  getStatusColor,
  getGradientClass,
  withOpacity,
  getStatusText,
  getPriorityText,
  truncateText,
  formatDate,
  calculatePercentage,
  generateId,
  debounce,
};