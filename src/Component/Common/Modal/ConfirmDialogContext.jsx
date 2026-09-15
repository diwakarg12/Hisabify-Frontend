import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import Button from '../Primitives/Button';
import { FaExclamationTriangle, FaTrashAlt, FaQuestionCircle } from 'react-icons/fa';

const ConfirmDialogContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return context.confirm;
};

export const ConfirmDialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});
  const resolverRef = useRef(null);

  const confirm = useCallback((optionsOrMessage) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;

      if (typeof optionsOrMessage === 'string') {
        setOptions({
          title: 'Confirm Action',
          message: optionsOrMessage,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          variant: 'danger',
        });
      } else {
        setOptions({
          title: optionsOrMessage?.title || 'Confirm Action',
          message: optionsOrMessage?.message || 'Are you sure you want to proceed?',
          confirmText: optionsOrMessage?.confirmText || 'Confirm',
          cancelText: optionsOrMessage?.cancelText || 'Cancel',
          variant: optionsOrMessage?.variant || 'danger',
        });
      }

      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={handleCancel}
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] p-5 sm:p-6 space-y-5 transition-all transform animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  options.variant === 'danger'
                    ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                    : options.variant === 'warning'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30'
                }`}
              >
                {options.variant === 'danger' ? (
                  <FaTrashAlt className="w-5 h-5" />
                ) : options.variant === 'warning' ? (
                  <FaExclamationTriangle className="w-5 h-5" />
                ) : (
                  <FaQuestionCircle className="w-5 h-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] leading-snug">
                  {options.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {options.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]/60">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                className="px-4 font-semibold text-xs sm:text-sm h-10"
              >
                {options.cancelText}
              </Button>
              <Button
                variant={options.variant === 'danger' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirm}
                className="px-5 font-semibold text-xs sm:text-sm h-10"
              >
                {options.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
};

export default ConfirmDialogProvider;
