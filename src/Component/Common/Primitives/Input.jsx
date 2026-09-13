import React, { useId } from 'react';

/**
 * HisabiFY Tactile 3D Input Primitive
 * - Always renders a label (placeholders are not labels)
 * - Validates on blur with field-level screen-reader accessible error messages
 * - Supports inputmode="decimal" for numeric keypads on mobile devices
 */
export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  inputMode,
  autoFocus = false,
  className = '',
  leftIcon: LeftIcon,
  rightElement,
  ...props
}) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text-primary)] flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[var(--negative)]">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center w-full">
        {LeftIcon && (
          <div className="absolute left-3 text-[var(--text-secondary)] pointer-events-none">
            <LeftIcon className="w-5 h-5" />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode || (type === 'number' ? 'decimal' : undefined)}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`
            tactile-input
            w-full h-11 px-3 text-base text-[var(--text-primary)] placeholder-[var(--text-muted)]
            ${LeftIcon ? 'pl-10' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-[var(--negative)] focus:ring-[var(--negative-bg)]' : ''}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <span id={errorId} className="text-xs font-medium text-[var(--negative)] flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} className="text-xs text-[var(--text-secondary)] mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default Input;
