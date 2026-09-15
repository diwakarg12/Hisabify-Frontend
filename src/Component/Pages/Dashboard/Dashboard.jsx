import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllGroup } from '../../../redux/groupSlice';
import { getExpenses, deleteExpense } from '../../../redux/expenseSlice';
import { formatMoney, CATEGORY_COLORS, formatRelativeDate } from '../../../helpers/formatters';
import { calculateUserBalances } from '../../../helpers/balanceCalculator';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Badge from '../../Common/Primitives/Badge';
import EmptyState from '../../Common/Primitives/EmptyState';
import AddExpenseModal from '../ExpenseListPage/AddExpenseModal';
import AddLendBorrowModal from '../ExpenseListPage/AddLendBorrowModal';
import SettleUpModal from '../ExpenseListPage/SettleUpModal';
import { useConfirm } from '../../Common/Modal/ConfirmDialogContext';
import { FaPlus, FaHandHoldingUsd, FaReceipt, FaWallet, FaArrowUp, FaArrowDown, FaUsers, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = [2024, 2025, 2026, 2027];

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { user } = useSelector((state) => state.auth);
  const { groups = [], groupLoading } = useSelector((state) => state.group);
  const { personalExpenses = [], groupExpenses = {}, expenseLoading } = useSelector((state) => state.expense);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isLendBorrowOpen, setIsLendBorrowOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [settleModalData, setSettleModalData] = useState({ isOpen: false, groupId: null, targetUser: null });

  // Month & Year Selector state (defaulting to current month/year)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getAllGroup());
    dispatch(getExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((g) => dispatch(getExpenses(g._id)));
    }
  }, [dispatch, groups]);

  // Compute live month-wise net financial balances
  const { youAreOwedTotal, youOweTotal, monthlySpent, groupBalancesMap } = calculateUserBalances(
    groups,
    groupExpenses,
    personalExpenses,
    user?._id,
    selectedMonth,
    selectedYear
  );

  // Top-3 category breakdown for personal spending in selected month
  const getPersonalCategoryBreakdown = () => {
    const categoryTotals = {};
    let totalPersonalAmount = 0;

    personalExpenses.forEach((exp) => {
      if (!exp.date || exp.isDeleted) return;
      const isLendCategory = exp.category === 'lentMoney' || exp.category === 'borrowedMoney';
      const isLendText =
        (exp.description || '').toLowerCase().includes('lent') ||
        (exp.description || '').toLowerCase().includes('borrowed');
      if (isLendCategory || isLendText) return;

      const d = new Date(exp.date);
      if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
        const cat = exp.category || 'other';
        const amt = Number(exp.amount || 0);
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
        totalPersonalAmount += amt;
      }
    });

    if (totalPersonalAmount === 0) return [];

    const sorted = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalPersonalAmount) * 100),
      }))
      .sort((a, b) => b.amount - a.amount);

    return sorted.slice(0, 3);
  };

  // Clean parser for Person Name and Note/Description
  const parseLendBorrowRecord = (rec) => {
    const isLent =
      rec.category === 'lentMoney' ||
      (rec.description || '').toLowerCase().startsWith('lent') ||
      (rec.description || '').toLowerCase().includes('lent to');
    let raw = rec.description || '';

    // Strip legacy prefixes if present
    raw = raw.replace(/^Lent to\s+/i, '').replace(/^Borrowed from\s+/i, '').replace(/^Lent\s+/i, '').replace(/^Borrowed\s+/i, '');

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

  // Retrieve ALL active lending & borrowing records (sorted newest first)
  const lendBorrowRecords = personalExpenses
    .filter((exp) => {
      if (!exp || exp.isDeleted) return false;
      const isLendCategory = exp.category === 'lentMoney' || exp.category === 'borrowedMoney';
      const isLendText =
        (exp.description || '').toLowerCase().includes('lent') ||
        (exp.description || '').toLowerCase().includes('borrowed');
      return isLendCategory || isLendText;
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const totalLentAmount = lendBorrowRecords
    .filter((e) => e.category === 'lentMoney' || (e.description || '').toLowerCase().includes('lent'))
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalBorrowedAmount = lendBorrowRecords
    .filter((e) => e.category === 'borrowedMoney' || (e.description || '').toLowerCase().includes('borrowed'))
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const top3Categories = getPersonalCategoryBreakdown();
  const hasAnyData = groups.length > 0 || personalExpenses.length > 0;
  const isLoading = groupLoading || expenseLoading;

  if (isLoading && !hasAnyData) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-[var(--surface-2)] rounded-2xl" />
          <div className="h-28 bg-[var(--surface-2)] rounded-2xl" />
          <div className="h-28 bg-[var(--surface-2)] rounded-2xl" />
        </div>
        <div className="h-64 bg-[var(--surface-2)] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Month Selector Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            Dashboard
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Month-wise financial summary & group balances
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {/* Top row on mobile: Month/Year Selection Bar + Lend/Borrow Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Month & Year Selection Bar */}
            <div className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-start gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
              <FaCalendarAlt className="text-[var(--brand)] w-3.5 h-3.5 ml-2 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-[var(--text-primary)] py-1.5 px-1.5 focus:outline-none cursor-pointer"
                aria-label="Select month"
              >
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-[var(--text-primary)] py-1.5 px-1.5 focus:outline-none cursor-pointer border-l border-[var(--border)]"
                aria-label="Select year"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsLendBorrowOpen(true)}
              icon={FaHandHoldingUsd}
              className="shrink-0 font-medium h-10 text-xs"
            >
              Lend / Borrow
            </Button>
          </div>

          {/* Add Expense Button: Full width below on mobile, auto width on desktop */}
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={() => {
              setSelectedGroupId(null);
              setIsAddExpenseOpen(true);
            }}
            icon={FaPlus}
            className="sm:w-auto font-semibold h-10 text-xs sm:text-sm"
          >
            Add expense
          </Button>
        </div>
      </div>

      {/* 1. Metric Summary Cards Row - Explicit Left Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* You Will Get */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--positive)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-3 text-left w-full">
            <div className="min-w-0 flex-1 text-left">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                You will get
              </span>
              <div className="text-2xl md:text-3xl font-extrabold text-[var(--positive)] tabular-nums truncate">
                {formatMoney(youAreOwedTotal)}
              </div>
              <span className="text-[11px] font-medium text-[var(--text-muted)] mt-1 block truncate">
                Overall total balance to receive
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-[var(--positive)] flex items-center justify-center shrink-0">
              <FaArrowDown className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* You Have To Give */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--negative)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-3 text-left w-full">
            <div className="min-w-0 flex-1 text-left">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                You have to give
              </span>
              <div className="text-2xl md:text-3xl font-extrabold text-[var(--negative)] tabular-nums truncate">
                {formatMoney(youOweTotal)}
              </div>
              <span className="text-[11px] font-medium text-[var(--text-muted)] mt-1 block truncate">
                Overall total balance to pay
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-[var(--negative)] flex items-center justify-center shrink-0">
              <FaArrowUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Spent This Month */}
        <Card className="p-4 sm:p-5 border-l-4 border-l-[var(--brand)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-3 text-left w-full">
            <div className="min-w-0 flex-1 text-left">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                Spent in {MONTHS[selectedMonth]}
              </span>
              <div className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tabular-nums truncate">
                {formatMoney(monthlySpent)}
              </div>
              <span className="text-[11px] font-semibold text-[var(--brand)] mt-1 block truncate">
                Duration: {MONTHS[selectedMonth]} {selectedYear}
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[var(--brand-light)] text-[var(--brand)] flex items-center justify-center shrink-0">
              <FaWallet className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Empty State for New User */}
      {!hasAnyData ? (
        <EmptyState
          title="Track your first expense"
          description="Add personal expenses or create a group to start splitting bills with friends."
          actionLabel="Add expense"
          onAction={() => setIsAddExpenseOpen(true)}
          icon={FaReceipt}
        />
      ) : (
        /* Asymmetric 12-Column Responsive Layout for Desktop */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Groups List (7 cols lg / 7 cols xl) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-0.5">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <FaUsers className="text-[var(--brand)]" /> Your groups
              </h3>
              <Button size="sm" variant="ghost" onClick={() => navigate('/teamlist')}>
                View all ({groups.length})
              </Button>
            </div>

            {groups.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-sm text-[var(--text-secondary)] mb-4">No groups created yet.</p>
                <Button size="sm" variant="secondary" onClick={() => navigate('/teamlist')}>
                  Create a group
                </Button>
              </Card>
            ) : (
              <div className={`grid grid-cols-1 ${groups.length > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
                {groups.map((group) => {
                  const gData = groupBalancesMap[group._id] || { netBalance: 0, memberBalances: [] };
                  const net = gData.netBalance;
                  const allMembers = (group.members || []).concat(group.dummyMembers || []);

                  return (
                    <Card
                      key={group._id}
                      interactive
                      onClick={() => navigate(`/group-expense/${group._id}`)}
                      className="flex flex-col justify-between h-full p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Group Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                              {group.groupName}
                            </h4>
                            {/* Member initial avatars */}
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {allMembers.slice(0, 4).map((m, idx) => (
                                  <div
                                    key={idx}
                                    className="w-5 h-5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[9px] font-bold text-[var(--text-secondary)] flex items-center justify-center shrink-0 uppercase"
                                    title={m.firstName || m.name}
                                  >
                                    {(m.firstName || m.name || '?')[0]}
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-[var(--text-muted)] ml-1">
                                {allMembers.length} members
                              </span>
                            </div>
                          </div>

                          <Badge variant={net > 0 ? 'positive' : net < 0 ? 'negative' : 'neutral'}>
                            {net > 0 ? `+${formatMoney(net)} to get` : net < 0 ? `-${formatMoney(Math.abs(net))} to give` : 'All clear'}
                          </Badge>
                        </div>

                        {/* Per-Person Balance Breakdown List */}
                        <div className="my-3 space-y-1.5 bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border)] text-xs">
                          {gData.memberBalances.length === 0 ? (
                            <span className="text-[var(--text-muted)] block text-center py-1">No active balance</span>
                          ) : (
                            gData.memberBalances.slice(0, 3).map((mb, i) => (
                              <div key={i} className="flex justify-between items-center py-1 border-b border-[var(--border)]/40 last:border-none">
                                <div>
                                  <span className="text-[var(--text-primary)] font-medium block truncate max-w-[130px]">
                                    {mb.member.firstName} {mb.member.lastName || ''}
                                  </span>
                                  <span className="text-[10px] text-[var(--text-muted)] block">
                                    Spent in {MONTHS[selectedMonth]}: {formatMoney(mb.totalSpent)}
                                  </span>
                                </div>
                                <span
                                  className={`font-semibold tabular-nums text-right ${mb.amount > 0 ? 'text-[var(--positive)]' : mb.amount < 0 ? 'text-[var(--negative)]' : 'text-[var(--text-muted)]'
                                    }`}
                                >
                                  {mb.amount > 0
                                    ? `will get ${formatMoney(mb.amount)}`
                                    : mb.amount < 0
                                      ? `has to give ${formatMoney(Math.abs(mb.amount))}`
                                      : 'All clear'}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
                        <Button
                          size="sm"
                          variant="secondary"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettleModalData({ isOpen: true, groupId: group._id, targetUser: null });
                          }}
                        >
                          Settle up
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGroupId(group._id);
                            setIsAddExpenseOpen(true);
                          }}
                          icon={FaPlus}
                        >
                          Add expense
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Personal Spending (5 cols lg / 5 cols xl) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] px-0.5">
              Personal spending
            </h3>
            <Card className="p-5 space-y-5 shadow-sm">
              <div className="flex flex-col pb-3 border-b border-[var(--border)] gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Total personal spent
                  </span>
                  <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                    {formatMoney(
                      personalExpenses.reduce((acc, curr) => {
                        if (!curr.date || curr.isDeleted) return acc;
                        const isLendCategory = curr.category === 'lentMoney' || curr.category === 'borrowedMoney';
                        const isLendText =
                          (curr.description || '').toLowerCase().includes('lent') ||
                          (curr.description || '').toLowerCase().includes('borrowed');
                        if (isLendCategory || isLendText) return acc;

                        const d = new Date(curr.date);
                        if (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) {
                          return acc + Number(curr.amount || 0);
                        }
                        return acc;
                      }, 0)
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[var(--brand)] font-semibold">
                  Duration: {MONTHS[selectedMonth]} {selectedYear}
                </span>
              </div>

              {/* Horizontal Bar Breakdown */}
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Top categories
                </h4>
                {top3Categories.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] py-4 text-center">
                    No personal expenses logged yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {top3Categories.map((item) => (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[var(--text-primary)] capitalize">
                            {item.category}
                          </span>
                          <span className="font-medium text-[var(--text-secondary)] tabular-nums">
                            {formatMoney(item.amount)} ({item.percentage}%)
                          </span>
                        </div>
                        {/* Bar Track */}
                        <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(item.percentage, 5)}%`,
                              backgroundColor: CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  fullWidth
                  onClick={() => navigate('/myexpense')}
                >
                  View all personal expenses
                </Button>
              </div>
            </Card>

            {/* Dedicated Section: Lending & Borrowing Ledger */}
            <div className="pt-2">
              <div className="flex items-center justify-between px-0.5 mb-2">
                <h3 className="text-base md:text-lg font-semibold text-[var(--text-primary)]">
                  Lending & Borrowing
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsLendBorrowOpen(true)}
                  icon={FaPlus}
                  className="text-xs"
                >
                  Record
                </Button>
              </div>

              <Card className="p-5 space-y-4 shadow-sm border-t-4 border-t-[var(--brand)]">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <h4 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <FaHandHoldingUsd className="text-[var(--brand)]" /> Direct Loans Ledger
                  </h4>
                  <span className="text-[11px] text-[var(--brand)] font-semibold">
                    All Active ({lendBorrowRecords.length})
                  </span>
                </div>

                {/* Summary totals bar */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-xs mb-3">
                  <div className="border-r border-[var(--border)] pr-2">
                    <span className="text-[var(--text-secondary)] block text-[10px] font-semibold uppercase">Total Lent</span>
                    <span className="font-extrabold text-[var(--positive)] tabular-nums text-sm">
                      {formatMoney(totalLentAmount)}
                    </span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[var(--text-secondary)] block text-[10px] font-semibold uppercase">Total Borrowed</span>
                    <span className="font-extrabold text-[var(--negative)] tabular-nums text-sm">
                      {formatMoney(totalBorrowedAmount)}
                    </span>
                  </div>
                </div>

                {/* Records List */}
                {lendBorrowRecords.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] py-3 text-center">
                    No active lending or borrowing records logged yet.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {lendBorrowRecords.map((rec) => {
                      const { isLent, personName, note } = parseLendBorrowRecord(rec);
                      return (
                        <div
                          key={rec._id}
                          className="p-3.5 bg-[var(--surface-2)]/70 rounded-xl border border-[var(--border)] space-y-2 hover:border-[var(--brand)]/40 transition-colors shadow-sm"
                        >
                          {/* Top Row: Badge + Person Name + Amount + Delete */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Badge variant={isLent ? 'positive' : 'negative'} size="sm" className="shrink-0 font-bold">
                                {isLent ? 'LENT' : 'BORROWED'}
                              </Badge>
                              <span className="font-bold text-sm text-[var(--text-primary)] truncate">
                                {personName}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`font-extrabold text-sm tabular-nums ${isLent ? 'text-[var(--positive)]' : 'text-[var(--negative)]'}`}>
                                {isLent ? '+' : '-'}{formatMoney(rec.amount)}
                              </span>
                              <button
                                onClick={async () => {
                                  const isConfirmed = await confirm({
                                    title: "Delete Record",
                                    message: `Delete record for '${personName}'? This action cannot be undone.`,
                                    confirmText: "Delete Record",
                                    cancelText: "Cancel",
                                    variant: "danger",
                                  });
                                  if (isConfirmed) {
                                    await dispatch(deleteExpense({ expenseId: rec._id, isPersonal: true, groupId: null }));
                                  }
                                }}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--negative)] hover:bg-[var(--negative-bg)] transition-colors"
                                title="Delete record"
                                aria-label="Delete record"
                              >
                                <FaTrashAlt className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Subtitle Row: Description (Note) & Date */}
                          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pt-1.5 border-t border-[var(--border)]/40">
                            <span className="truncate pr-2 font-medium">
                              {note ? note : 'No description'}
                            </span>
                            <span className="shrink-0 text-[11px] font-semibold text-[var(--text-muted)]">
                              {formatRelativeDate(rec.date)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultGroupId={selectedGroupId}
      />

      {/* Dedicated Lend & Borrow Modal */}
      <AddLendBorrowModal
        isOpen={isLendBorrowOpen}
        onClose={() => setIsLendBorrowOpen(false)}
      />

      {/* Settle Up Modal */}
      {settleModalData.isOpen && (
        <SettleUpModal
          isOpen={settleModalData.isOpen}
          onClose={() => setSettleModalData({ isOpen: false, groupId: null, targetUser: null })}
          groupId={settleModalData.groupId}
        />
      )}
    </div>
  );
};

export default Dashboard;
