import React, { useState, useEffect } from 'react';

/**
 * HisabiFY Brand Logo Component
 * - Mobile / Phone screen: Stacked logo (logo-stacked.svg)
 * - Tablet & Desktop screen: Horizontal logo (logo-horizontal.svg)
 * - Dynamically switches SVG theme assets based on current app dark/light mode
 */
export const Logo = ({ size = 'md', className = '' }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
             document.documentElement.getAttribute('data-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      const darkActive = document.documentElement.classList.contains('dark') ||
                         document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(darkActive);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

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

  const stackedSrc = isDark ? '/logo-stacked-dark.svg' : '/logo-stacked.svg';
  const horizontalSrc = isDark ? '/logo-horizontal-dark.svg' : '/logo-horizontal.svg';

  return (
    <div className={`inline-flex items-center shrink-0 transform transition-transform hover:scale-105 select-none ${className}`}>
      {/* Mobile / Phone screens (< sm) */}
      <img
        src={stackedSrc}
        alt="HisabiFY Logo"
        className={`${stackedHeight} w-auto object-contain block sm:hidden`}
      />

      {/* Tablet / Desktop screens (>= sm) */}
      <img
        src={horizontalSrc}
        alt="HisabiFY Logo"
        className={`${horizontalHeight} w-auto object-contain hidden sm:block`}
      />
    </div>
  );
};

export default Logo;

