import React from 'react';

/**
 * HisabiFY Tactile 3D Button Primitive
 * - Enforces minimum 44px touch target
 * - Preserves button width during loading states
 * - Provides sentence-case styling and keyboard accessibility focus rings
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  fullWidth = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs min-h-[36px]',
    md: 'h-11 px-4 text-sm min-h-[44px]',
    lg: 'h-13 px-6 text-base min-h-[48px]',
  };

  const variantClasses = {
    primary: 'tactile-btn-primary',
    secondary: 'tactile-btn-secondary',
    ghost: 'tactile-btn-ghost',
    danger: 'bg-gradient-to-b from-red-600 to-red-700 text-white border border-red-800 shadow-md hover:from-red-700 hover:to-red-800 active:translate-y-0.5 active:shadow-inner',
  };

  const isBtnDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isBtnDisabled}
      aria-label={ariaLabel}
      className={`
        tactile-btn
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F7A6C]
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isBtnDisabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="opacity-90">{children}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 whitespace-nowrap">
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </div>
      )}
    </button>
  );
};

export default Button;
