import React from 'react';
import { Avatar } from '@mui/material';

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationTile = ({
  message,
  title,
  action,
  sender,
  createdAt,
  isRead,
  amount,
  item,
  teamName,
  adderName,
  time,
}) => {
  const senderName = sender
    ? `${sender.firstName} ${sender.lastName || ''}`.trim()
    : adderName || 'Group Member';

  const actionText = action || (amount ? 'ADDED' : 'UPDATED');
  const displayMessage =
    message ||
    `${teamName ? `${teamName}: ` : ''}${senderName} ${
      amount ? `added ₹${amount} for ${item}` : 'updated an expense'
    }`;
  const displayTime = createdAt ? formatTimeAgo(createdAt) : time || 'recently';

  const getBadgeColor = () => {
    if (actionText === 'ADDED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (actionText === 'UPDATED') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (actionText === 'DELETED') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div
      className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
        isRead === false
          ? 'bg-[var(--brand-light)] border-[var(--brand)]/30'
          : 'bg-[var(--surface-1)] border-[var(--border)]'
      }`}
    >
      <Avatar
        src={sender?.profile}
        sx={{ width: 34, height: 34, bgcolor: '#1F7A6C', fontSize: 13, fontWeight: 700 }}
      >
        {senderName.charAt(0)}
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getBadgeColor()}`}>
            {actionText}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">{displayTime}</span>
        </div>

        <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
          {title || displayMessage}
        </p>

        {title && message && (
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
            {message}
          </p>
        )}
      </div>

      {isRead === false && (
        <span className="w-2 h-2 rounded-full bg-[var(--brand)] shrink-0 mt-1.5" />
      )}
    </div>
  );
};

export default NotificationTile;