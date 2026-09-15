import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenses, deleteExpense } from '../../../redux/expenseSlice';
import { formatMoney, formatRelativeDate } from '../../../helpers/formatters';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Badge from '../../Common/Primitives/Badge';
import Input from '../../Common/Primitives/Input';
import EmptyState from '../../Common/Primitives/EmptyState';
import AddLendBorrowModal from '../ExpenseListPage/AddLendBorrowModal';
import { useConfirm } from '../../Common/Modal/ConfirmDialogContext';
import {
  FaHandHoldingUsd,
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
} from 'react-icons/fa';

export const LendBorrowContainer = () => {
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const { personalExpenses = [], expenseLoading } = useSelector((state) => state.expense);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'lent' | 'borrowed'

  useEffect(() => {
    dispatch(getExpenses({ groupId: null }));
  }, [dispatch]);

  // Clean parser for Person Name and Note/Description
  const parseLendBorrowRecord = (rec) => {
    const isLent =
      rec.category === 'lentMoney' ||
      (rec.description || '').toLowerCase().startsWith('lent') ||
      (rec.description || '').toLowerCase().includes('lent to');
    let raw = rec.description || '';

    // Strip legacy prefixes if present
    raw = raw
      .replace(/^Lent to\s+/i, '')
      .replace(/^Borrowed from\s+/i, '')
      .replace(/^Lent\s+/i, '')
      .replace(/^Borrowed\s+/i, '');

    let personName = raw;
    let note = '';

    if (raw.includes(' (')) {
      const parts = raw.split(' (');
      personName = parts[0];
      note = parts.slice(1).join(' (').replace(/\)$/, '');
    } else if (raw.includes(' - ')) {
      const parts = raw.split(' - ');
      personName = parts[0];
      note = parts.slice(1).join(' - ');
    }

    return { isLent, personName: personName.trim() || 'Person', note: note.trim() };
  };

  // Extract all-time active lend & borrow records
  const allLendBorrowRecords = useMemo(() => {
    return personalExpenses
      .filter((exp) => {
        if (!exp || exp.isDeleted) return false;
        const isLendCategory = exp.category === 'lentMoney' || exp.category === 'borrowedMoney';
        const isLendText =
          (exp.description || '').toLowerCase().includes('lent') ||
          (exp.description || '').toLowerCase().includes('borrowed');
        return isLendCategory || isLendText;
      })
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [personalExpenses]);

  // All-time Totals
  const totalLentAmount = useMemo(() => {
    return allLendBorrowRecords
      .filter((e) => e.category === 'lentMoney' || (e.description || '').toLowerCase().includes('lent'))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [allLendBorrowRecords]);

  const totalBorrowedAmount = useMemo(() => {
    return allLendBorrowRecords
      .filter((e) => e.category === 'borrowedMoney' || (e.description || '').toLowerCase().includes('borrowed'))
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  }, [allLendBorrowRecords]);

  const netPosition = totalLentAmount - totalBorrowedAmount;

  // Filtered list based on Search and Tab selection
  const filteredRecords = useMemo(() => {
    return allLendBorrowRecords.filter((rec) => {
      const { isLent, personName, note } = parseLendBorrowRecord(rec);

      // Type filter
      if (filterType === 'lent' && !isLent) return false;
      if (filterType === 'borrowed' && isLent) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return personName.toLowerCase().includes(q) || note.toLowerCase().includes(q);
    });
  }, [allLendBorrowRecords, filterType, searchQuery]);

  const handleDeleteRecord = async (rec) => {
    const { personName } = parseLendBorrowRecord(rec);
    const isConfirmed = await confirm({
      title: 'Delete Record',
      message: `Delete record for '${personName}'? This action cannot be undone.`,
      confirmText: 'Delete Record',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (isConfirmed) {
      await dispatch(deleteExpense({ expenseId: rec._id, isPersonal: true, groupId: null })).unwrap();
      dispatch(getExpenses({ groupId: null }));
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <FaHandHoldingUsd className="text-[var(--brand)] w-6 h-6" />
            Lend & Borrow Ledger
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-0.5">
            All-time cumulative records of money lent to or borrowed from friends and contacts
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          icon={FaPlus}
          className="shrink-0 h-11 whitespace-nowrap"
        >
          Record Lend / Borrow
        </Button>
      </div>

      {/* Metric Cards - 3 Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Lent */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--positive)] shadow-[var(--shadow-3d)] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <span>Total You Lent</span>
            <FaArrowDown className="text-[var(--positive)] w-3.5 h-3.5" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-[var(--positive)] tabular-nums block">
            {formatMoney(totalLentAmount)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-medium block">
            Money to be collected
          </span>
        </Card>

        {/* Total Borrowed */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--negative)] shadow-[var(--shadow-3d)] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <span>Total You Borrowed</span>
            <FaArrowUp className="text-[var(--negative)] w-3.5 h-3.5" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-[var(--negative)] tabular-nums block">
            {formatMoney(totalBorrowedAmount)}
          </span>
          <span className="text-[11px] text-[var(--text-muted)] font-medium block">
            Money to be repaid
          </span>
        </Card>

        {/* Net Position */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--brand)] shadow-[var(--shadow-3d)] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <span>Net Position</span>
            <FaExchangeAlt className="text-[var(--brand)] w-3.5 h-3.5" />
          </div>
          <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tabular-nums block">
            {formatMoney(Math.abs(netPosition))}
          </span>
          <Badge
            variant={netPosition > 0 ? 'positive' : netPosition < 0 ? 'negative' : 'neutral'}
            size="sm"
            className="font-bold"
          >
            {netPosition > 0
              ? 'You will get overall'
              : netPosition < 0
              ? 'You have to give overall'
              : 'All clear'}
          </Badge>
        </Card>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <Input
          placeholder="Search by person name or note..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={FaSearch}
          className="w-full sm:w-72"
        />

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All ({allLendBorrowRecords.length})
          </button>
          <button
            onClick={() => setFilterType('lent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'lent'
                ? 'bg-[var(--positive-bg)] text-[var(--positive)] border border-[var(--positive)]/30 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Lent (Gave)
          </button>
          <button
            onClick={() => setFilterType('borrowed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'borrowed'
                ? 'bg-[var(--negative-bg)] text-[var(--negative)] border border-[var(--negative)]/30 shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Borrowed (Took)
          </button>
        </div>
      </div>

      {/* Records List Container */}
      {filteredRecords.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No matching records' : 'No lending or borrowing records'}
          description={
            searchQuery
              ? `No records found matching "${searchQuery}"`
              : 'Log direct loans or money borrowed from friends to keep track of all-time balances.'
          }
          actionLabel="Record Lend / Borrow"
          onAction={() => setIsModalOpen(true)}
          icon={FaHandHoldingUsd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => {
            const { isLent, personName, note } = parseLendBorrowRecord(rec);

            return (
              <Card
                key={rec._id}
                className="p-4 space-y-3 shadow-[var(--shadow-3d)] hover:border-[var(--brand)]/40 transition-all"
              >
                {/* Header Row: Badge + Person Name + Amount + Delete */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant={isLent ? 'positive' : 'negative'} size="sm" className="shrink-0 font-extrabold">
                      {isLent ? 'LENT' : 'BORROWED'}
                    </Badge>
                    <span className="font-extrabold text-base text-[var(--text-primary)] truncate">
                      {personName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-black text-base tabular-nums ${
                        isLent ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
                      }`}
                    >
                      {isLent ? '+' : '-'}{formatMoney(rec.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(rec)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--negative)] hover:bg-[var(--negative-bg)] transition-colors"
                      title="Delete record"
                      aria-label="Delete record"
                    >
                      <FaTrashAlt className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle Row: Description / Note & Date */}
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border)]/40">
                  <span className="truncate pr-2 font-medium">
                    {note ? note : 'No additional note'}
                  </span>
                  <span className="shrink-0 font-semibold text-[var(--text-muted)]">
                    {formatRelativeDate(rec.date)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Global Add Lend / Borrow Modal */}
      <AddLendBorrowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default LendBorrowContainer;
