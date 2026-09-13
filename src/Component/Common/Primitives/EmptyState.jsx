import React from 'react';
import Button from './Button';
import Card from './Card';

/**
 * HisabiFY EmptyState Primitive
 * Adheres to Section 4.3 Copy & 4.4 State Coverage rules:
 * - Empty states are invitations ("Track your first expense"), never reports.
 * - Headline, one line of context explanation, one primary action.
 */
export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  className = '',
}) => {
  return (
    <Card className={`text-center py-10 px-6 flex flex-col items-center justify-center border-dashed border-2 border-[var(--border-strong)] bg-[var(--surface-1)] ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] text-[var(--brand)] flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
