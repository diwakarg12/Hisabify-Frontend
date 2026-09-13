import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../../redux/expenseSlice';
import { formatMoney } from '../../../helpers/formatters';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import { FaCheckCircle, FaTimes, FaExchangeAlt } from 'react-icons/fa';

export const SettleUpModal = ({ isOpen, onClose, groupId }) => {
  const dispatch = useDispatch();

  const { groups = [] } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);

  const group = groups.find((g) => String(g._id) === String(groupId));
  const members = group
    ? [
        ...(group.members || []),
        ...(group.dummyMembers || []).map((d) => ({
          _id: d._id,
          dummyId: d._id,
          firstName: d.name,
          lastName: '(Guest)',
          isDummy: true,
        })),
      ].filter((m) => String(m._id) !== String(user?._id))
    : [];

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?._id || '');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSettledSuccess, setIsSettledSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !group) return null;

  const targetMember = members.find((m) => String(m._id) === String(selectedMemberId)) || members[0];
  const targetName = targetMember ? `${targetMember.firstName} ${targetMember.lastName || ''}`.trim() : 'Member';

  const handleSettleUpSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid settlement amount');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      amount: numericAmount,
      description: `Settlement: ${user?.firstName} settled with ${targetName}`,
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      createdFor: user?._id,
      groupId,
      splitwith: targetMember?.isDummy
        ? [{ dummyId: targetMember.dummyId, name: targetMember.firstName }]
        : [{ userId: targetMember?._id }],
    };

    try {
      await dispatch(addExpense({ groupId, data: payload })).unwrap();
      setIsSubmitting(false);
      setIsSettledSuccess(true);
      setTimeout(() => {
        setIsSettledSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      setIsSubmitting(false);
      setError(err?.message || 'Could not record settlement. Please retry.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settle-title"
    >
      <div className="w-full max-w-md bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <h2 id="settle-title" className="text-lg font-semibold text-[var(--text-primary)]">
            Settle up
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-1)] transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {isSettledSuccess ? (
          /* Animated Bold Settle-Up Confirmation Moment (Rule 5.7) */
          <div className="p-8 text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-[var(--positive-bg)] text-[var(--positive)] flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <FaCheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                Settled!
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Recorded settlement of <span className="font-bold text-[var(--positive)]">{formatMoney(amount)}</span> between <span className="font-medium text-[var(--text-primary)]">You</span> and <span className="font-medium text-[var(--text-primary)]">{targetName}</span>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSettleUpSubmit} className="p-5 space-y-4">
            {/* Person selector */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 block">
                Settle up with
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="tactile-input w-full h-11 px-3 text-sm"
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.firstName} {m.lastName || ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Visual Exchange Badge */}
            <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-center gap-3 text-sm font-medium text-[var(--text-primary)]">
              <span>You</span>
              <FaExchangeAlt className="text-[var(--brand)] w-4 h-4" />
              <span>{targetName}</span>
            </div>

            {/* Settlement Amount */}
            <Input
              label="Settlement amount (₹)"
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={error}
              required
              autoFocus
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                Settle up
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SettleUpModal;
