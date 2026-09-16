import React from 'react';

/**
 * HisabiFY Brand Logo Component
 * - Mobile / Phone screen: Stacked logo (logo-stacked.svg)
 * - Tablet & Desktop screen: Horizontal logo (logo-horizontal.svg)
 */
export const Logo = ({ size = 'md', className = '' }) => {
  const horizontalHeight = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14',
  }[size] || 'h-9';

  const stackedHeight = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
  }[size] || 'h-12';

  return (
    <div className={`inline-flex items-center shrink-0 transform transition-transform hover:scale-105 select-none ${className}`}>
      {/* Phone screens (< sm): Logo Stacked */}
      <img
        src="/logo-stacked.svg"
        alt="HisabiFY Logo"
        className={`${stackedHeight} w-auto object-contain block sm:hidden`}
      />

      {/* Larger screens (sm & up): Logo Horizontal */}
      <img
        src="/logo-horizontal.svg"
        alt="HisabiFY Logo"
        className={`${horizontalHeight} w-auto object-contain hidden sm:block`}
      />
    </div>
  );
};

export default Logo;
