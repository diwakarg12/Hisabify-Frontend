import React from 'react';
import { getCategoryColor } from '../../../helpers/formatters';

/**
 * HisabiFY Badge Primitive
 * Supports:
 * 1. Category Badges (using fixed category colors)
 * 2. Balance Pills (Positive green / Negative red / Neutral)
 */
export const Badge = ({
  children,
  variant = 'neutral', // 'positive' | 'negative' | 'neutral' | 'category'
  categoryName,
  className = '',
  size = 'md', // 'sm' | 'md'
}) => {
  if (variant === 'category') {
    const bgColor = getCategoryColor(categoryName || children);
    return (
      <span
        style={{ backgroundColor: `${bgColor}20`, color: bgColor, borderColor: `${bgColor}40` }}
        className={`
          inline-flex items-center font-semibold rounded-full border px-2.5 py-0.5 text-xs tracking-wide
          ${className}
        `}
      >
        <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: bgColor }} />
        {categoryName || children}
      </span>
    );
  }

  const variantStyles = {
    positive: 'bg-[var(--positive-bg)] text-[var(--positive)] border-[var(--positive)]/30',
    negative: 'bg-[var(--negative-bg)] text-[var(--negative)] border-[var(--negative)]/30',
    neutral: 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border-strong)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs md:text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border shadow-sm tabular-nums
        ${variantStyles[variant] || variantStyles.neutral}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
