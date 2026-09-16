import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, getExpenses } from '../../../redux/expenseSlice';
import { formatMoney } from '../../../helpers/formatters';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import { FaTimes, FaCamera, FaUsers, FaTag, FaCalendarAlt, FaUser } from 'react-icons/fa';

const CATEGORIES = [
  { id: 'groceries', label: 'Groceries' },
  { id: 'foodDining', label: 'Food & Dining' },
  { id: 'transport', label: 'Transport' },
  { id: 'utilities', label: 'Utilities' },
  { id: 'health', label: 'Health' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'education', label: 'Education' },
  { id: 'rent', label: 'Rent' },
  { id: 'other', label: 'Other' },
];

export const AddExpenseModal = ({ isOpen, onClose, defaultGroupId = null }) => {
  const dispatch = useDispatch();
  const amountInputRef = useRef(null);

  const { groups = [] } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);

  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(localStorage.getItem('last_category') || 'foodDining');
  const [selectedGroup, setSelectedGroup] = useState(defaultGroupId || '');
  const [paidBy, setPaidBy] = useState(user?._id || '');
  const [splitMethod, setSplitMethod] = useState('equally'); // 'equally' | 'exact' | 'percentage'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [receiptImage, setReceiptImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-focus amount field on modal open
  useEffect(() => {
    if (isOpen) {
      if (user?._id) {
        setPaidBy(user._id);
      }
      setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (defaultGroupId) {
      setSelectedGroup(defaultGroupId);
    }
  }, [defaultGroupId]);

  const currentGroupObj = groups.find((g) => String(g._id) === String(selectedGroup));

  const activeCategories = React.useMemo(() => {
    if (currentGroupObj?.categories && currentGroupObj.categories.length > 0) {
      return currentGroupObj.categories.map((c) => ({ id: c, label: c }));
    }
    return CATEGORIES;
  }, [currentGroupObj]);

  if (!isOpen) return null;

  // Determine split participants
  const members = currentGroupObj
    ? [
        ...(currentGroupObj.members || []),
        ...(currentGroupObj.dummyMembers || []).map((d) => ({
          _id: d._id,
          dummyId: d._id,
          firstName: d.name,
          lastName: '(Guest)',
          isDummy: true,
        })),
      ]
    : [];

  const totalParticipants = members.length || 1;
  const numericAmount = parseFloat(amount) || 0;

  // Live split calculation with exact paise reconciliation
  const calculateEqualSplits = () => {
    if (numericAmount <= 0 || totalParticipants === 0) return [];
    const baseShare = Math.floor((numericAmount / totalParticipants) * 100) / 100;
    const remainder = Math.round((numericAmount - baseShare * totalParticipants) * 100) / 100;

    return members.map((m, index) => {
      // Assign remainder paisa to the payer (index 0 / logged in user)
      const finalShare = index === 0 ? baseShare + remainder : baseShare;
      return {
        member: m,
        share: finalShare,
      };
    });
  };

  const calculatedSplits = calculateEqualSplits();

  const validate = () => {
    const errs = {};
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Save last used category for speed
    localStorage.setItem('last_category', category);

    const payload = {
      amount: numericAmount,
      description: description.trim(),
      category,
      date,
      createdBy: paidBy || user?._id,
      createdFor: paidBy || user?._id,
      receiptImage,
      groupId: selectedGroup || null,
      splitwith: members.map((m) =>
        m.isDummy
          ? { dummyId: m.dummyId, name: m.firstName }
          : { userId: m._id }
      ),
    };

    try {
      await dispatch(addExpense({ groupId: selectedGroup || null, data: payload })).unwrap();
      dispatch(getExpenses(selectedGroup || null));
      setIsSubmitting(false);
      // Reset form fields
      setAmount('');
      setDescription('');
      setReceiptImage('');
      setErrors({});
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setErrors({ submit: err?.message || 'Could not save expense. Please retry.' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-expense-title"
    >
      <div className="w-full max-w-lg bg-[var(--surface-1)] border border-[var(--border)] rounded-t-2xl sm:rounded-2xl shadow-[var(--shadow-floating)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]/50">
          <h2 id="add-expense-title" className="text-lg font-semibold text-[var(--text-primary)]">
            {defaultGroupId ? 'Add group expense' : 'Add expense'}
          </h2>
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
          {/* Main Amount Input */}
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

          {/* Description */}
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dinner at Sagar Ratna"
            error={errors.description}
            required
          />

          {/* Group, Paid by, and Category selects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <FaUsers className="text-[var(--text-secondary)]" /> Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                }}
                disabled={Boolean(defaultGroupId)}
                className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
              >
                <option value="">Personal expense</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <FaUser className="text-[var(--text-secondary)]" /> Paid by
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
              >
                {members.length > 0 ? (
                  members.map((m) => (
                    <option key={m._id || m.dummyId} value={m._id || m.dummyId}>
                      {m.firstName} {m.lastName || ''} {m._id === user?._id ? '(You)' : ''}
                    </option>
                  ))
                ) : (
                  <option value={user?._id}>You ({user?.firstName || 'User'})</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <FaTag className="text-[var(--text-secondary)]" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
              >
                {activeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Split Breakdown Preview */}
          {selectedGroup && calculatedSplits.length > 0 && (
            <div className="p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)]">
                <span>Split equally ({calculatedSplits.length} members)</span>
                <span className="text-[var(--brand)] font-bold">Live share</span>
              </div>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {calculatedSplits.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-0.5">
                    <span className="text-[var(--text-primary)] font-medium">
                      {item.member.firstName} {item.member.lastName || ''}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {formatMoney(item.share, 'INR', 'en-IN', true)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date & Receipt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

            <div>
              <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                <FaCamera className="text-[var(--text-secondary)]" /> Receipt photo
              </label>
              <label className="tactile-input w-full h-11 px-3 text-xs flex items-center justify-center cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <span>{receiptImage ? 'Receipt attached ✓' : 'Upload receipt'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {errors.submit && (
            <p className="text-xs text-[var(--negative)] font-medium text-center">{errors.submit}</p>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Save expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;

