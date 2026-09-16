import React, { useState, useEffect } from 'react';
import NotificationTile from './NotificationTile';
import { FaTimes, FaBell, FaCheckDouble } from 'react-icons/fa';
import { API_BASE_URL, getAuthHeaders } from '../../../config/Api';

export const NotificationDialog = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/notification/getAll`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/notification/markAllRead`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end p-4 pt-16 sm:pr-12 bg-black/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <div className="flex items-center gap-2">
            <FaBell className="w-4 h-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-[var(--brand)] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1 font-semibold px-2 py-1 rounded-md"
                title="Mark all as read"
              >
                <FaCheckDouble className="w-3 h-3" /> Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-1)] transition-colors"
              aria-label="Close notifications"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-[var(--text-secondary)]">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif, idx) => (
              <NotificationTile key={notif._id || idx} {...notif} />
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
                <FaBell className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;
