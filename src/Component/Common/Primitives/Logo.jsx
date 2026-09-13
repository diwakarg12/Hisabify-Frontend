import React from 'react';

/**
 * HisabiFY 3D Tactile Logo Mark Component
 * Brand: Deep Teal (#1F7A6C) + Indigo accents
 */
export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { box: 'w-7 h-7', text: 'text-lg', icon: 'w-4 h-4' },
    md: { box: 'w-9 h-9', text: 'text-xl', icon: 'w-5 h-5' },
    lg: { box: 'w-11 h-11', text: 'text-2xl', icon: 'w-6 h-6' },
  }[size] || { box: 'w-9 h-9', text: 'text-xl', icon: 'w-5 h-5' };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* 3D Tactile Logo Icon */}
      <div className={`${dimensions.box} rounded-xl bg-gradient-to-br from-[#269685] to-[#176054] text-white flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(31,122,108,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] border border-teal-700 shrink-0 transform transition-transform hover:scale-105`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={dimensions.icon}
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>

      {showText && (
        <span className={`${dimensions.text} font-bold tracking-tight text-[var(--text-primary)] font-sans`}>
          Hisabi<span className="text-[var(--brand)]">FY</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
