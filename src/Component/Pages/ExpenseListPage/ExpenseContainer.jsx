import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getExpenses, deleteExpense } from '../../../redux/expenseSlice';
import { formatMoney, formatRelativeDate, CATEGORY_COLORS } from '../../../helpers/formatters';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Badge from '../../Common/Primitives/Badge';
import Input from '../../Common/Primitives/Input';
import EmptyState from '../../Common/Primitives/EmptyState';
import AddExpenseModal from './AddExpenseModal';
import SettleUpModal from './SettleUpModal';
import {
  FaSearch,
  FaPlus,
  FaReceipt,
  FaTrashAlt,
  FaTimes,
  FaUser,
  FaCalendarAlt,
  FaImage,
  FaShoppingBasket,
  FaUtensils,
  FaCar,
  FaBolt,
  FaHeartbeat,
  FaGamepad,
  FaShoppingBag,
  FaGraduationCap,
  FaHome,
  FaHandHoldingUsd,
} from 'react-icons/fa';

export const ExpenseContainer = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { groups = [] } = useSelector((state) => state.group);
  const { expenses = [], groupExpenses = {}, expenseLoading } = useSelector((state) => {
    return {
      expenses: groupId ? state.expense.groupExpenses[groupId] || [] : state.expense.personalExpenses || [],
      expenseLoading: state.expense.expenseLoading,
      groupExpenses: state.expense.groupExpenses,
    };
  });

  const group = groups.find((g) => String(g._id) === String(groupId));

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (groupId) {
      dispatch(getExpenses(groupId));
    } else {
      dispatch(getExpenses());
    }
  }, [groupId, dispatch]);

  useEffect(() => {
    if (expenses.length > 0 && !selectedExpense) {
      setSelectedExpense(expenses[0]);
    }
  }, [expenses, selectedExpense]);

  // Filtered Expenses (Month, Year, Search, Category)
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (!item || item.isDeleted) return false;
      const d = item.date ? new Date(item.date) : new Date();

      const matchMonth = d.getMonth() === Number(selectedMonth);
      const matchYear = d.getFullYear() === Number(selectedYear);

      const matchSearch =
        !searchQuery.trim() ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchMonth && matchYear && matchSearch && matchCategory;
    });
  }, [expenses, selectedMonth, selectedYear, searchQuery, selectedCategory]);

  // Group by sticky dates
  const groupedByDate = useMemo(() => {
    const map = {};
    filteredExpenses.forEach((exp) => {
      const relDate = formatRelativeDate(exp.date);
      if (!map[relDate]) map[relDate] = [];
      map[relDate].push(exp);
    });
    return map;
  }, [filteredExpenses]);

  const totalPeriodSpend = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const handleDelete = async (expense) => {
    if (window.confirm(`Delete '${expense.description}'? This can't be undone.`)) {
      await dispatch(
        deleteExpense({
          expenseId: expense._id,
          isPersonal: expense.isPersonal,
          groupId: groupId || null,
        })
      ).unwrap();
      setSelectedExpense(null);
      setIsMobileDetailOpen(false);
    }
  };

  const handleExpenseClick = (item) => {
    setSelectedExpense(item);
    // On mobile screens, open detail popup modal
    if (window.innerWidth < 1024) {
      setIsMobileDetailOpen(true);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getCategoryIcon = (catKey) => {
    const c = (catKey || '').toLowerCase();
    if (c === 'groceries') return FaShoppingBasket;
    if (c === 'fooddining' || c === 'food & dining') return FaUtensils;
    if (c === 'transport') return FaCar;
    if (c === 'utilities') return FaBolt;
    if (c === 'health') return FaHeartbeat;
    if (c === 'entertainment') return FaGamepad;
    if (c === 'shopping') return FaShoppingBag;
    if (c === 'education') return FaGraduationCap;
    if (c === 'rent') return FaHome;
    if (c.includes('lent') || c.includes('lend') || c.includes('friend')) return FaHandHoldingUsd;
    return FaReceipt;
  };

  // Reusable Expense Detail Content Component
  const DetailContent = ({ expense, onCloseMobile }) => {
    if (!expense) {
      return (
        <Card className="text-center py-10 text-[var(--text-secondary)]">
          Select an expense from the list to view details.
        </Card>
      );
    }

    return (
      <Card className="space-y-4 shadow-[var(--shadow-3d)]">
        {/* Header with Title & Action Buttons */}
        <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
          <div>
            <Badge variant="category" categoryName={expense.category}>
              {expense.category}
            </Badge>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1.5 leading-snug">
              {expense.description}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleDelete(expense)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--negative)] hover:bg-[var(--negative-bg)] transition-colors"
              title="Delete expense"
              aria-label="Delete expense"
            >
              <FaTrashAlt className="w-4 h-4" />
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                aria-label="Close detail modal"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Amount Banner */}
        <div className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] text-center">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase">
            Total amount
          </span>
          <div className="text-3xl font-extrabold text-[var(--brand)] tabular-nums mt-1">
            {formatMoney(expense.amount, 'INR', 'en-IN', true)}
          </div>
        </div>

        {/* Details Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
            <span className="text-[var(--text-secondary)]">Paid by</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {expense.createdBy?._id === user?._id
                ? 'You'
                : `${expense.createdBy?.firstName || ''} ${expense.createdBy?.lastName || ''}`}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border)]/50">
            <span className="text-[var(--text-secondary)]">Date</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {formatRelativeDate(expense.date)}
            </span>
          </div>

          {/* Split Info Breakdown per person */}
          {expense.splitInfo?.splits?.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                Split breakdown
              </span>
              <div className="bg-[var(--surface-2)] p-3 rounded-lg space-y-1.5 text-xs">
                {expense.splitInfo.splits.map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[var(--text-primary)] font-medium">
                      {s.user
                        ? s.user._id === user?._id
                          ? 'You'
                          : `${s.user.firstName} ${s.user.lastName || ''}`
                        : s.name || 'Guest'}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {formatMoney(s.splittedAmount, 'INR', 'en-IN', true)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipt Photo Preview if present */}
          {expense.receiptImage && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                Receipt
              </span>
              <div className="rounded-xl overflow-hidden border border-[var(--border)] max-h-48">
                <img
                  src={expense.receiptImage}
                  alt="Receipt"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
          {groupId ? group?.groupName || 'Group expenses' : 'Personal expenses'}
        </h2>
        <p className="text-xs md:text-sm text-[var(--text-secondary)]">
          {groupId ? 'Shared expenses & split details' : 'Track and manage your personal spending'}
        </p>
      </div>

      {/* Row 1: Month Selection, Year Selection, and Settle Up Button taking full width */}
      <div className={`grid ${groupId ? 'grid-cols-3' : 'grid-cols-2'} gap-2 w-full`}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
        >
          {months.map((m, idx) => (
            <option key={idx} value={idx}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="tactile-input w-full h-11 px-3 text-xs sm:text-sm font-medium"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {groupId && (
          <Button size="sm" variant="secondary" fullWidth onClick={() => setIsSettleOpen(true)} className="h-11">
            Settle up
          </Button>
        )}
      </div>

      {/* Row 2: Search Description or Category */}
      <Input
        placeholder="Search description or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftIcon={FaSearch}
        className="w-full"
      />

      {/* Row 3: Category Filter (60% width) + Add Expense Button (40% width) - Exact Matching Height */}
      <div className="flex items-center gap-2 w-full">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="tactile-input h-11 px-3 text-xs sm:text-sm font-medium w-[60%] shrink-0 border border-[var(--border)] rounded-lg box-border"
        >
          <option value="all">All categories</option>
          <option value="groceries">Groceries</option>
          <option value="foodDining">Food & Dining</option>
          <option value="transport">Transport</option>
          <option value="utilities">Utilities</option>
          <option value="health">Health</option>
          <option value="entertainment">Entertainment</option>
          <option value="shopping">Shopping</option>
          <option value="education">Education</option>
          <option value="rent">Rent</option>
          <option value="other">Other</option>
        </select>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsAddExpenseOpen(true)}
          icon={FaPlus}
          className="w-[40%] shrink-0 whitespace-nowrap h-11 text-xs sm:text-sm font-semibold"
        >
          Add expense
        </Button>
      </div>

      {/* Total Period Spend Card with baseline text alignment & explicit duration indicator */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-8 border-l-4 border-l-[var(--brand)] shadow-[var(--shadow-3d)]">
        <div>
          <span className="text-xs sm:text-sm font-extrabold text-[var(--text-secondary)] uppercase tracking-wider block">
            Total spent in this period
          </span>
          <span className="text-xs font-semibold text-[var(--brand)] mt-0.5 block">
            Duration: {months[selectedMonth]} {selectedYear}
          </span>
        </div>
        <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tabular-nums">
          {formatMoney(totalPeriodSpend)}
        </span>
      </Card>

      {/* Main Content Split Pane */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="No transactions logged for the selected period or filters."
          actionLabel="Add expense"
          onAction={() => setIsAddExpenseOpen(true)}
          icon={FaReceipt}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Sticky Date Grouped List */}
          <div className="col-span-1 lg:col-span-7 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {Object.entries(groupedByDate).map(([dateLabel, items]) => (
              <div key={dateLabel} className="space-y-2.5">
                {/* Sticky Date Header */}
                <div className="sticky top-0 z-10 bg-[var(--bg-page)]/95 backdrop-blur-sm py-1.5 font-semibold text-xs text-[var(--text-secondary)] border-b border-[var(--border)] uppercase tracking-wider flex items-center gap-2">
                  <FaCalendarAlt className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>{dateLabel}</span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => {
                    const isSelected = selectedExpense?._id === item._id;
                    const payerName =
                      item.createdBy?._id === user?._id
                        ? 'You'
                        : `${item.createdBy?.firstName || 'Member'}`;

                    const CatIcon = getCategoryIcon(item.category);
                    const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other;

                    return (
                      <div
                        key={item._id}
                        onClick={() => handleExpenseClick(item)}
                        className={`
                          tactile-card p-3.5 sm:p-4 flex items-center justify-between gap-3.5 cursor-pointer transition-all duration-150 rounded-xl
                          ${isSelected ? 'border-2 border-[var(--brand)] shadow-md bg-[var(--surface-1)] ring-2 ring-[var(--brand)]/15' : 'hover:border-[var(--border-strong)] hover:translate-y-[-1px]'}
                        `}
                      >
                        {/* Redesigned Category Icon Badge Tile */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor,
                            border: `1px solid ${catColor}40`,
                          }}
                        >
                          <CatIcon className="w-5 h-5" />
                        </div>

                        {/* Title & Metadata Details */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4 className="font-bold text-sm text-[var(--text-primary)] truncate leading-tight">
                            {item.description}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--text-secondary)]">
                            <span className="capitalize font-semibold text-[var(--text-primary)] bg-[var(--surface-2)] px-2 py-0.5 rounded-md border border-[var(--border)] text-[11px]">
                              {item.category || 'Other'}
                            </span>
                            <span>•</span>
                            <span>Paid by <strong className="text-[var(--text-primary)] font-semibold">{payerName}</strong></span>
                            {item.receiptImage && (
                              <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-medium ml-1">
                                <FaImage className="w-3 h-3" /> Receipt
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right-aligned Tabular Monetary Figure */}
                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-base sm:text-lg text-[var(--text-primary)] tabular-nums block">
                            {formatMoney(item.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Pane Desktop Only: Sticky Detail Card (5 Cols) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-2 self-start">
            <DetailContent expense={selectedExpense} />
          </div>
        </div>
      )}

      {/* Mobile Detail Popup Modal (Appears when tapping an expense on phone screens) */}
      {isMobileDetailOpen && selectedExpense && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsMobileDetailOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-[var(--shadow-floating)]"
            onClick={(e) => e.stopPropagation()}
          >
            <DetailContent
              expense={selectedExpense}
              onCloseMobile={() => setIsMobileDetailOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultGroupId={groupId}
      />

      {/* Settle Up Modal */}
      {isSettleOpen && (
        <SettleUpModal
          isOpen={isSettleOpen}
          onClose={() => setIsSettleOpen(false)}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default ExpenseContainer;
