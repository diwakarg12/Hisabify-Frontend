import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from '../../../redux/expenseSlice';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import { FaTimes, FaHandHoldingUsd, FaCalendarAlt, FaUser, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export const AddLendBorrowModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const amountInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  // Form state
  const [type, setType] = useState('lent'); // 'lent' (I gave money) | 'borrowed' (I took money)
  const [personName, setPersonName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    if (!personName.trim()) {
      errs.personName = 'Person name is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const numericAmount = parseFloat(amount);

    const isLent = type === 'lent';
    const formattedDesc = note.trim()
      ? `${personName.trim()} (${note.trim()})`
      : personName.trim();

    const payload = {
      amount: numericAmount,
      description: formattedDesc,
      category: isLent ? 'lentMoney' : 'borrowedMoney',
      date,
      createdBy: user?._id,
      createdFor: user?._id,
      groupId: null,
      isPersonal: true,
    };

    try {
      await dispatch(addExpense({ groupId: null, data: payload })).unwrap();
      setIsSubmitting(false);
      onClose();
      // Reset form
      setAmount('');
      setPersonName('');
      setNote('');
      setType('lent');
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ submit: err?.message || 'Failed to save record. Please try again.' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lend-borrow-title"
    >
      <div className="w-full max-w-lg bg-[var(--surface-1)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]/50">
          <div className="flex items-center gap-2">
            <FaHandHoldingUsd className="text-[var(--brand)] w-5 h-5" />
            <h2 id="lend-borrow-title" className="text-lg font-bold text-[var(--text-primary)]">
              Record Lend / Borrow Amount
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Transaction Type Segmented Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setType('lent')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'lent'
                  ? 'bg-[var(--positive-bg)] text-[var(--positive)] border border-[var(--positive)]/30 shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FaArrowDown className="w-3.5 h-3.5" />
              <span>I Lent Money (Gave)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('borrowed')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                type === 'borrowed'
                  ? 'bg-[var(--negative-bg)] text-[var(--negative)] border border-[var(--negative)]/30 shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FaArrowUp className="w-3.5 h-3.5" />
              <span>I Borrowed (Took)</span>
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)] text-center shadow-inner">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Amount
            </label>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-bold text-[var(--brand)]">₹</span>
              <input
                ref={amountInputRef}
                type="number"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-44 text-3xl font-extrabold text-[var(--text-primary)] bg-transparent border-b-2 border-[var(--brand)] text-center focus:outline-none tabular-nums"
                required
              />
            </div>
            {errors.amount && (
              <p className="text-xs font-medium text-[var(--negative)] mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Friend / Person Name */}
          <Input
            label={type === 'lent' ? 'Lent to (Friend or Person Name)' : 'Borrowed from (Friend or Person Name)'}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder={type === 'lent' ? 'e.g. Rahul, Priya' : 'e.g. Landlord, Uncle'}
            error={errors.personName}
            required
            icon={FaUser}
          />

          {/* Date & Note/Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <FaCalendarAlt className="text-[var(--text-secondary)]" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="tactile-input w-full h-11 px-3 text-sm font-medium"
              />
            </div>

            <Input
              label="Note / Reason (Optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Lunch cash, Cab fare"
            />
          </div>

          {errors.submit && (
            <p className="text-xs text-[var(--negative)] font-medium text-center">{errors.submit}</p>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="h-11"
            >
              {type === 'lent' ? 'Save Lending Record' : 'Save Borrowing Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLendBorrowModal;
