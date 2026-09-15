import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reviewReceivedRequest } from '../../../redux/requestSlice';
import { getAllGroup } from '../../../redux/groupSlice';
import RequestTile from './RequestTile';
import { FaTimes, FaUserPlus } from 'react-icons/fa';

export const RequestDailog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request.receivedRequest || []);

  if (!open) return null;

  const handleRequestAction = async (status, requestId, groupId) => {
    await dispatch(reviewReceivedRequest({ status, requestId, groupId })).unwrap();
    await dispatch(getAllGroup()).unwrap();
  };

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
            <FaUserPlus className="w-4 h-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Group invitations</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-1)] transition-colors"
            aria-label="Close invitations"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-3">
          {requests && requests.length > 0 ? (
            requests.map((request, index) => (
              <RequestTile
                key={request._id || index}
                request={request}
                handleRequestAction={handleRequestAction}
              />
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] flex items-center justify-center mx-auto">
                <FaUserPlus className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">No pending invitations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDailog;
