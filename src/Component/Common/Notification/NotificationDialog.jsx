import React from 'react';
import NotificationTile from './NotificationTile';
import { FaTimes, FaBell } from 'react-icons/fa';

export const NotificationDialog = ({ open, onClose }) => {
  if (!open) return null;

  const notifications = []; // Loaded live or passed via props

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-4 pt-16 sm:pr-12 bg-black/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <div className="flex items-center gap-2">
            <FaBell className="w-4 h-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-1)] transition-colors"
            aria-label="Close notifications"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notif, idx) => (
              <NotificationTile key={idx} {...notif} />
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
                <FaBell className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;
