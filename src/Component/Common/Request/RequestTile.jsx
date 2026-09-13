import React from 'react';
import Button from '../Primitives/Button';
import { formatRelativeDate } from '../../../helpers/formatters';

export const RequestTile = ({ request, handleRequestAction }) => {
  if (!request) return null;

  const dateStr = request.updatedAt ? formatRelativeDate(request.updatedAt) : 'Recently';

  return (
    <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2 text-xs">
      <p className="font-semibold text-[var(--text-primary)]">
        Invited you to join <span className="text-[var(--brand)] font-bold">{request.groupId?.groupName || 'Group'}</span>
      </p>

      <p className="text-[var(--text-secondary)]">
        By {request.invitedBy?.firstName} {request.invitedBy?.lastName || ''} • {dateStr}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleRequestAction('accepted', request._id, request.groupId?._id)}
          className="!bg-[var(--positive)] hover:!bg-emerald-600 shadow-none text-xs"
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleRequestAction('rejected', request._id, request.groupId?._id)}
          className="text-[var(--negative)] hover:bg-[var(--negative-bg)] text-xs"
        >
          Decline
        </Button>
      </div>
    </div>
  );
};

export default RequestTile;
