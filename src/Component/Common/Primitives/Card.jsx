import React from 'react';

/**
 * HisabiFY Tactile 3D Card Primitive
 * - 12px border-radius, 1px --border hairline
 * - Consistent 20px padding (desktop) / 16px (mobile)
 * - In-flow 3D depth shadow with inset light highlights
 */
export const Card = ({
  children,
  className = '',
  interactive = false,
  onClick,
  header,
  footer,
  ...props
}) => {
  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`
        tactile-card
        ${interactive ? 'tactile-card-interactive cursor-pointer' : ''}
        p-4 md:p-5 flex flex-col justify-between
        ${className}
      `}
      {...props}
    >
      {header && <div className="mb-3 border-b border-[var(--border)] pb-3">{header}</div>}
      <div className="flex-1">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-[var(--border)]">{footer}</div>}
    </div>
  );
};

export default Card;
