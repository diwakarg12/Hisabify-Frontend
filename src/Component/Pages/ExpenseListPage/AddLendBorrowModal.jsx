import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, editExpense, getExpenses } from '../../../redux/expenseSlice';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import { FaTimes, FaHandHoldingUsd, FaCalendarAlt, FaUser, FaArrowUp, FaArrowDown, FaCheck, FaLock, FaTrashAlt } from 'react-icons/fa';

export const AddLendBorrowModal = ({
  isOpen,
  onClose,
  initialType = 'lent',
  initialPersonName = '',
  recordToEdit = null,
  onDelete = null,
}) => {
  const dispatch = useDispatch();
  const amountInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { personalExpenses = [] } = useSelector((state) => state.expense);
  const { groups = [] } = useSelector((state) => state.group);

  // Form state
  const [type, setType] = useState(initialType);
  const [personName, setPersonName] = useState(initialPersonName);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEditMode = Boolean(recordToEdit);

  useEffect(() => {
    if (isOpen) {
      if (recordToEdit) {
        const isLent =
          recordToEdit.category === 'lentMoney' ||
          (recordToEdit.description || '').toLowerCase().includes('lent');
        let raw = recordToEdit.description || '';
        raw = raw
          .replace(/^Lent to\s+/i, '')
          .replace(/^Borrowed from\s+/i, '')
          .replace(/^Lent\s+/i, '')
          .replace(/^Borrowed\s+/i, '');

        let parsedName = raw;
        let parsedNote = '';
        if (raw.includes(' (')) {
          const parts = raw.split(' (');
          parsedName = parts[0];
          parsedNote = parts.slice(1).join(' (').replace(/\)$/, '');
        } else if (raw.includes(' - ')) {
          const parts = raw.split(' - ');
          parsedName = parts[0];
          parsedNote = parts.slice(1).join(' - ');
        }

        setType(isLent ? 'lent' : 'borrowed');
        setPersonName(parsedName.trim());
        setAmount(recordToEdit.amount || '');
        setNote(parsedNote.trim());
        setDate(recordToEdit.date ? recordToEdit.date.split('T')[0] : new Date().toISOString().split('T')[0]);
      } else {
        setType(initialType || 'lent');
        setPersonName(initialPersonName || '');
        setAmount('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        setTimeout(() => {
          if (amountInputRef.current) {
            amountInputRef.current.focus();
          }
        }, 100);
      }
      setErrors({});
    }
  }, [isOpen, initialType, initialPersonName, recordToEdit]);

  // Handle click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Deduplicated list of person names
  const existingPersonNames = useMemo(() => {
    const nameMap = new Map();

    const addName = (rawName) => {
      if (!rawName || typeof rawName !== 'string') return;
      let clean = rawName.split('(')[0].trim();
      if (!clean) return;
      const normalized = clean.toLowerCase();
      if (!nameMap.has(normalized)) {
        nameMap.set(normalized, clean);
      }
    };

    (personalExpenses || []).forEach((exp) => {
      if (exp.category === 'lentMoney' || exp.category === 'borrowedMoney') {
        addName(exp.description);
      }
    });

    (groups || []).forEach((g) => {
      (g.members || []).forEach((m) => {
        if (String(m._id) !== String(user?._id)) {
          addName(`${m.firstName || ''} ${m.lastName || ''}`);
        }
      });
      (g.dummyMembers || []).forEach((d) => {
        addName(d.name);
      });
    });

    try {
      const saved = JSON.parse(localStorage.getItem('hisabify_lend_borrow_names') || '[]');
      if (Array.isArray(saved)) {
        saved.forEach(addName);
      }
    } catch (e) {
      // ignore
    }

    return Array.from(nameMap.values());
  }, [personalExpenses, groups, user?._id]);

  const filteredSuggestions = useMemo(() => {
    const query = personName.trim().toLowerCase();
    if (!query) return existingPersonNames;
    return existingPersonNames.filter((name) =>
      name.toLowerCase().includes(query)
    );
  }, [existingPersonNames, personName]);

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
    const cleanPersonName = personName.trim();

    const isLent = type === 'lent';
    const formattedDesc = note.trim()
      ? `${cleanPersonName} (${note.trim()})`
      : cleanPersonName;

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
      if (isEditMode) {
        await dispatch(
          editExpense({
            expenseId: recordToEdit._id,
            data: payload,
            isPersonal: true,
            groupId: null,
          })
        ).unwrap();
      } else {
        await dispatch(addExpense({ groupId: null, data: payload })).unwrap();
      }
      dispatch(getExpenses({ groupId: null }));

      try {
        const saved = JSON.parse(localStorage.getItem('hisabify_lend_borrow_names') || '[]');
        const updated = [cleanPersonName, ...saved.filter((n) => n.toLowerCase() !== cleanPersonName.toLowerCase())].slice(0, 25);
        localStorage.setItem('hisabify_lend_borrow_names', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      setIsSubmitting(false);
      onClose();
      setShowSuggestions(false);
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
              {isEditMode ? 'Edit Lend / Borrow Record' : 'Record Lend / Borrow Amount'}
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
          <div className="bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)] text-center shadow-inner relative">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
              Amount {isEditMode && '(Locked)'}
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
                disabled={isEditMode}
                className={`w-44 text-3xl font-extrabold text-[var(--text-primary)] bg-transparent border-b-2 border-[var(--brand)] text-center focus:outline-none tabular-nums ${
                  isEditMode ? 'opacity-70 cursor-not-allowed border-dashed' : ''
                }`}
                required
              />
            </div>
            {isEditMode && (
              <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1.5 flex items-center justify-center gap-1">
                <FaLock className="w-3 h-3 text-[var(--brand)]" /> Amount cannot be changed after creation
              </p>
            )}
            {errors.amount && (
              <p className="text-xs font-medium text-[var(--negative)] mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Friend / Person Name with Auto-Suggestion Dropdown & Quick-Select Chips */}
          <div className="relative" ref={dropdownRef}>
            <Input
              label={type === 'lent' ? 'Lent to (Friend or Person Name)' : 'Borrowed from (Friend or Person Name)'}
              value={personName}
              onChange={(e) => {
                setPersonName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={type === 'lent' ? 'e.g. Rahul, Priya' : 'e.g. Landlord, Uncle'}
              error={errors.personName}
              required
              leftIcon={FaUser}
              autoComplete="off"
            />

            {/* Floating Suggestions List */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-40 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)]/50 flex justify-between items-center bg-[var(--surface-2)]/50">
                  <span>Suggested Contacts ({filteredSuggestions.length})</span>
                  <span className="text-[var(--brand)] font-semibold text-[10px] lowercase">Click to select</span>
                </div>
                {filteredSuggestions.map((name, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPersonName(name);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--brand-light)] hover:text-[var(--brand)] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FaUser className="w-3 h-3 text-[var(--brand)] shrink-0" />
                      <span className="truncate">{name}</span>
                    </span>
                    {personName.trim().toLowerCase() === name.toLowerCase() && (
                      <FaCheck className="w-3 h-3 text-[var(--brand)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

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
          <div className="pt-2 flex items-center gap-2">
            {isEditMode && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  onClose();
                  onDelete(recordToEdit);
                }}
                className="h-11 px-4 text-xs font-bold shrink-0"
              >
                <FaTrashAlt className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              className="h-11 font-bold"
            >
              {isEditMode
                ? 'Update Record'
                : type === 'lent'
                ? 'Save Lending Record'
                : 'Save Borrowing Record'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLendBorrowModal;
