import React, { useEffect, useState, useMemo } from 'react';
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
import ScanAndPayModal from '../../Common/ScanAndPay/ScanAndPayModal';
import { useConfirm } from '../../Common/Modal/ConfirmDialogContext';
import { FaPlus, FaHandHoldingUsd, FaReceipt, FaWallet, FaArrowUp, FaArrowDown, FaUsers, FaCalendarAlt, FaTrashAlt, FaQrcode } from 'react-icons/fa';

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
  const [isScanPayOpen, setIsScanPayOpen] = useState(false);
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
      (rec.description || '').toLowerCase().includes('lent');
    let raw = rec.description || '';
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

  // Aggregate by contact and compute Top 2-3 people by maximum pending amount
  const { topLendBorrowContacts, totalReceivable, totalPayable, totalContactsCount } = useMemo(() => {
    const map = {};

    lendBorrowRecords.forEach((rec) => {
      const { isLent, personName } = parseLendBorrowRecord(rec);
      const key = personName.trim().toLowerCase();

      if (!map[key]) {
        map[key] = {
          key,
          name: personName,
          lentTotal: 0,
          borrowedTotal: 0,
          netBalance: 0,
          lastDate: rec.createdAt || rec.date || 0,
          entriesCount: 0,
        };
      }

      const amt = Number(rec.amount || 0);
      if (isLent) {
        map[key].lentTotal += amt;
      } else {
        map[key].borrowedTotal += amt;
      }
      map[key].entriesCount += 1;

      const recTime = new Date(rec.createdAt || rec.date || 0).getTime();
      const lastTime = new Date(map[key].lastDate).getTime();
      if (recTime > lastTime) {
        map[key].lastDate = rec.createdAt || rec.date;
      }
    });

    let recSum = 0;
    let paySum = 0;
    Object.values(map).forEach((c) => {
      c.netBalance = c.lentTotal - c.borrowedTotal;
      if (c.netBalance > 0) recSum += c.netBalance;
      else if (c.netBalance < 0) paySum += Math.abs(c.netBalance);
    });

    // Rank contacts: unsettled balances first, sorted by highest absolute amount pending
    const unsettledContacts = Object.values(map)
      .filter((c) => c.netBalance !== 0)
      .sort((a, b) => Math.abs(b.netBalance) - Math.abs(a.netBalance));

    // Pick top 2-3 people with max amount (fallback to top volume if all settled)
    const topContacts = unsettledContacts.length > 0
      ? unsettledContacts.slice(0, 3)
      : Object.values(map).sort((a, b) => (b.lentTotal + b.borrowedTotal) - (a.lentTotal + a.borrowedTotal)).slice(0, 3);

    return {
      topLendBorrowContacts: topContacts,
      totalReceivable: recSum,
      totalPayable: paySum,
      totalContactsCount: Object.keys(map).length,
    };
  }, [lendBorrowRecords]);

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

            {/* Redesigned Section: Lending & Borrowing (Top 2-3 People by Amount) */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between px-0.5">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)]">
                    Lend & Borrow
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Top pending balances
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsLendBorrowOpen(true)}
                    icon={FaPlus}
                    className="text-xs font-semibold"
                  >
                    Record
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/lend-borrow')}
                    className="text-xs font-semibold text-[var(--brand)]"
                  >
                    View all
                  </Button>
                </div>
              </div>

              <div className="tactile-card rounded-2xl p-5 bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-3d)] space-y-4">
                {/* Calculated Summary Totals Bar */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse" />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        You Will Get
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-[var(--positive)] tabular-nums tracking-tight">
                      {formatMoney(totalReceivable)}
                    </div>
                  </div>

                  <div className="space-y-1 border-l border-[var(--border)] pl-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--negative)] animate-pulse" />
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        You Will Give
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-[var(--negative)] tabular-nums tracking-tight">
                      {formatMoney(totalPayable)}
                    </div>
                  </div>
                </div>

                {/* Top 2-3 Contacts by Max Pending Balance */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    <span>Top Balances</span>
                    {totalContactsCount > 0 && (
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold lowercase">
                        showing {topLendBorrowContacts.length} of {totalContactsCount} contact{totalContactsCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {topLendBorrowContacts.length === 0 ? (
                    <div className="py-6 text-center space-y-3">
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        No active lending or borrowing records logged yet.
                      </p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsLendBorrowOpen(true)}
                        icon={FaPlus}
                        className="text-xs font-bold"
                      >
                        Record Entry
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {topLendBorrowContacts.map((contact) => {
                        const isGet = contact.netBalance > 0;
                        const isGive = contact.netBalance < 0;

                        return (
                          <div
                            key={contact.key}
                            onClick={() =>
                              navigate(`/lend-borrow?contact=${encodeURIComponent(contact.key)}`, {
                                state: { selectedContactKey: contact.key },
                              })
                            }
                            className="p-3 bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] rounded-xl border border-[var(--border)] hover:border-[var(--brand)]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs"
                            title={`Click to open ${contact.name}'s transaction details`}
                          >
                            {/* Left: Avatar + Name + Entries count */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-[var(--brand-light)] text-[var(--brand)] font-black text-sm flex items-center justify-center shrink-0 border border-[var(--brand)]/20 group-hover:scale-105 transition-transform shadow-xs">
                                {contact.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--brand)] transition-colors">
                                  {contact.name}
                                </h5>
                                <p className="text-[11px] text-[var(--text-muted)] font-medium">
                                  {contact.entriesCount} transaction{contact.entriesCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>

                            {/* Right: Net Calculation Amount & Label */}
                            <div className="text-right shrink-0">
                              <div
                                className={`text-sm sm:text-base font-black tabular-nums tracking-tight ${
                                  isGet
                                    ? 'text-[var(--positive)]'
                                    : isGive
                                    ? 'text-[var(--negative)]'
                                    : 'text-[var(--text-muted)]'
                                }`}
                              >
                                {isGet && '+'}
                                {isGive && '-'}
                                {formatMoney(Math.abs(contact.netBalance))}
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider block ${
                                  isGet
                                    ? 'text-[var(--positive)]'
                                    : isGive
                                    ? 'text-[var(--negative)]'
                                    : 'text-[var(--text-muted)]'
                                }`}
                              >
                                {isGet ? 'You get' : isGive ? 'You give' : 'Settled'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Link to Full Lend & Borrow Page */}
                <div className="pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate('/lend-borrow')}
                    className="font-bold text-xs h-10"
                  >
                    Open Full Lend & Borrow Ledger →
                  </Button>
                </div>
              </div>
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
