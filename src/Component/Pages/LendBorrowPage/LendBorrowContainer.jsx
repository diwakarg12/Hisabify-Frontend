import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getExpenses, deleteExpense } from '../../../redux/expenseSlice';
import {
  formatMoney,
  formatOkCreditDate,
  formatTimeOnly,
} from '../../../helpers/formatters';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Input from '../../Common/Primitives/Input';
import EmptyState from '../../Common/Primitives/EmptyState';
import AddLendBorrowModal from '../ExpenseListPage/AddLendBorrowModal';
import { useConfirm } from '../../Common/Modal/ConfirmDialogContext';
import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaEdit,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaChevronLeft,
  FaFileAlt,
  FaCheck,
  FaShareAlt,
  FaTimes,
} from 'react-icons/fa';

export const LendBorrowContainer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const transactionsContainerRef = useRef(null);

  const { personalExpenses = [] } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('lent');
  const [modalPersonName, setModalPersonName] = useState('');
  const [recordToEdit, setRecordToEdit] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonKey, setSelectedPersonKey] = useState(null);

  // Status Filter: 'all' | 'get' | 'give' | 'settled'
  const [statusFilter, setStatusFilter] = useState('all');
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  useEffect(() => {
    dispatch(getExpenses({ groupId: null }));
  }, [dispatch]);

  // Lock outer main scroll container when inside transaction detail page so ONLY transactions can scroll
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (selectedPersonKey) {
      if (mainEl) {
        mainEl.scrollTop = 0;
        mainEl.style.overflow = 'hidden';
      }
      // Reset transactions scroll to top so all transactions are visible from the start
      if (transactionsContainerRef.current) {
        transactionsContainerRef.current.scrollTop = 0;
      }
    } else {
      if (mainEl) {
        mainEl.style.overflow = '';
      }
    }

    return () => {
      if (mainEl) {
        mainEl.style.overflow = '';
      }
    };
  }, [selectedPersonKey]);

  // Robust parser for Person Name, Note & Transaction Type
  const parseLendBorrowRecord = (rec) => {
    const desc = rec.description || '';
    const lowerDesc = desc.toLowerCase();
    const isLent =
      rec.category === 'lentMoney' ||
      lowerDesc.startsWith('lent') ||
      lowerDesc.includes('lent to');

    let raw = desc
      .replace(/^Lent to\s+/i, '')
      .replace(/^Borrowed from\s+/i, '')
      .replace(/^Lent\s+/i, '')
      .replace(/^Borrowed\s+/i, '')
      .trim();

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

    if (!personName || !personName.trim()) {
      personName = 'General Contact';
    }

    return {
      isLent,
      personName: personName.trim(),
      note: note.trim(),
    };
  };

  // Filter personal expenses for lend & borrow entries
  const lendBorrowRecords = useMemo(() => {
    return personalExpenses.filter((exp) => {
      if (!exp || exp.isDeleted) return false;
      const isLendCategory = exp.category === 'lentMoney' || exp.category === 'borrowedMoney';
      const isLendText =
        (exp.description || '').toLowerCase().includes('lent') ||
        (exp.description || '').toLowerCase().includes('borrowed');
      return isLendCategory || isLendText;
    });
  }, [personalExpenses]);

  // Group entries by contact & calculate total gave, total took, net balance & running balance
  const contactsMap = useMemo(() => {
    const map = {};

    lendBorrowRecords.forEach((rec) => {
      const { isLent, personName, note } = parseLendBorrowRecord(rec);
      const key = personName.toLowerCase().trim();

      if (!map[key]) {
        map[key] = {
          key,
          name: personName,
          lentTotal: 0,
          borrowedTotal: 0,
          netBalance: 0,
          lastDate: rec.date || rec.createdAt || 0,
          transactions: [],
        };
      }

      const amt = Number(rec.amount || 0);
      if (isLent) {
        map[key].lentTotal += amt;
      } else {
        map[key].borrowedTotal += amt;
      }

      map[key].transactions.push({
        ...rec,
        parsedIsLent: isLent,
        parsedNote: note,
      });

      const recTime = new Date(rec.date || rec.createdAt || 0).getTime();
      const lastTime = new Date(map[key].lastDate).getTime();
      if (recTime > lastTime) {
        map[key].lastDate = rec.date || rec.createdAt;
      }
    });

    // Sort chronologically ascending from top to bottom by lend or borrow date
    Object.values(map).forEach((contact) => {
      contact.netBalance = contact.lentTotal - contact.borrowedTotal;

      contact.transactions.sort((a, b) => {
        const timeA = new Date(a.date || a.createdAt || 0).getTime();
        const timeB = new Date(b.date || b.createdAt || 0).getTime();
        if (timeA !== timeB) return timeA - timeB;
        const createdA = new Date(a.createdAt || 0).getTime();
        const createdB = new Date(b.createdAt || 0).getTime();
        return createdA - createdB;
      });

      let currBalance = 0;
      contact.transactions.forEach((tx) => {
        const amt = Number(tx.amount || 0);
        if (tx.parsedIsLent) {
          currBalance += amt;
        } else {
          currBalance -= amt;
        }
        tx.runningBalance = currBalance;
        if (currBalance > 0) {
          tx.runningBalanceText = `${formatMoney(currBalance)} Due`;
        } else if (currBalance < 0) {
          tx.runningBalanceText = `${formatMoney(Math.abs(currBalance))} Advance`;
        } else {
          tx.runningBalanceText = `₹0.00 Settled`;
        }
      });
    });

    return map;
  }, [lendBorrowRecords]);

  // Overall totals across all contacts
  const { totalYouWillGet, totalYouWillGive } = useMemo(() => {
    let getSum = 0;
    let giveSum = 0;
    Object.values(contactsMap).forEach((c) => {
      if (c.netBalance > 0) getSum += c.netBalance;
      else if (c.netBalance < 0) giveSum += Math.abs(c.netBalance);
    });
    return { totalYouWillGet: getSum, totalYouWillGive: giveSum };
  }, [contactsMap]);

  // Filtered contacts list
  const contactsList = useMemo(() => {
    return Object.values(contactsMap)
      .filter((c) => {
        const matchesSearch =
          !searchQuery.trim() || c.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

        if (!matchesSearch) return false;
        if (statusFilter === 'get') return c.netBalance > 0;
        if (statusFilter === 'give') return c.netBalance < 0;
        if (statusFilter === 'settled') return c.netBalance === 0;
        return true;
      })
      .sort((a, b) => new Date(b.lastDate || 0) - new Date(a.lastDate || 0));
  }, [contactsMap, searchQuery, statusFilter]);

  const activeContact = selectedPersonKey ? contactsMap[selectedPersonKey] : null;

  // Handle auto-opening contact detail view when navigated from Dashboard or direct link
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const contactFromParam = searchParams.get('contact');
    const contactKeyFromState = location.state?.selectedContactKey;

    const rawTarget = contactKeyFromState || contactFromParam;
    if (rawTarget) {
      const targetKey = rawTarget.trim().toLowerCase();
      if (contactsMap[targetKey]) {
        setSelectedPersonKey(targetKey);
      }
    }
  }, [location, contactsMap]);

  const handleBackToContacts = () => {
    setSelectedPersonKey(null);
    if (location.search || location.state?.selectedContactKey) {
      navigate('/lend-borrow', { replace: true, state: {} });
    }
  };

  const handleDeleteRecord = async (rec) => {
    const { personName } = parseLendBorrowRecord(rec);
    const isConfirmed = await confirm({
      title: 'Delete Record',
      message: `Delete transaction for '${personName}'? This action cannot be undone.`,
      confirmText: 'Delete Record',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (isConfirmed) {
      await dispatch(deleteExpense({ expenseId: rec._id, isPersonal: true, groupId: null })).unwrap();
      dispatch(getExpenses({ groupId: null }));
    }
  };

  const openNewTransaction = (type = 'lent', personName = '') => {
    setRecordToEdit(null);
    setModalType(type);
    setModalPersonName(personName);
    setIsModalOpen(true);
  };

  const openEditTransaction = (rec) => {
    setRecordToEdit(rec);
    setIsModalOpen(true);
  };

  // Group active contact transactions by date
  const groupedChatTransactions = useMemo(() => {
    if (!activeContact?.transactions) return [];
    const groups = [];
    let currentGroup = null;

    activeContact.transactions.forEach((tx) => {
      const dateLabel = formatOkCreditDate(tx.date || tx.createdAt);
      if (!currentGroup || currentGroup.dateLabel !== dateLabel) {
        currentGroup = { dateLabel, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(tx);
    });

    return groups;
  }, [activeContact]);

  // Send WhatsApp Payment Reminder
  const handleWhatsAppRemind = () => {
    if (!activeContact) return;
    const balance = activeContact.netBalance;
    let message = '';
    if (balance > 0) {
      message = `Hi ${activeContact.name}, your total due balance on Hisabify is ${formatMoney(
        balance
      )}. Please settle it at your earliest convenience. Thank you!`;
    } else if (balance < 0) {
      message = `Hi ${activeContact.name}, I owe you a balance of ${formatMoney(
        Math.abs(balance)
      )}. I will settle it soon. Thank you!`;
    } else {
      message = `Hi ${activeContact.name}, our account balance is completely settled (₹0). Thank you!`;
    }
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* 1. OVERALL TOTALS BANNER (ONLY SHOWN ON MAIN CONTACTS OVERVIEW SCREEN) */}
      {!selectedPersonKey && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Total Receivable Card */}
          <div className="tactile-card rounded-2xl p-5 bg-[var(--surface-1)] border border-[var(--border)] relative overflow-hidden shadow-[var(--shadow-3d)] transition-all hover:shadow-[var(--shadow-3d-hover)] group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--positive)] animate-pulse" />
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Total Receivable
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--positive)] tabular-nums tracking-tight">
                  {formatMoney(totalYouWillGet)}
                </div>
                <p className="text-xs text-[var(--text-muted)] font-medium pt-0.5">
                  You will collect from <strong className="text-[var(--text-primary)] font-semibold">{contactsList.filter(c => c.netBalance > 0).length}</strong> contact{contactsList.filter(c => c.netBalance > 0).length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[var(--positive-bg)] text-[var(--positive)] flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <FaArrowDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Total Payable Card */}
          <div className="tactile-card rounded-2xl p-5 bg-[var(--surface-1)] border border-[var(--border)] relative overflow-hidden shadow-[var(--shadow-3d)] transition-all hover:shadow-[var(--shadow-3d-hover)] group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-400" />
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--negative)] animate-pulse" />
                  <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Total Payable
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[var(--negative)] tabular-nums tracking-tight">
                  {formatMoney(totalYouWillGive)}
                </div>
                <p className="text-xs text-[var(--text-muted)] font-medium pt-0.5">
                  You have to give to <strong className="text-[var(--text-primary)] font-semibold">{contactsList.filter(c => c.netBalance < 0).length}</strong> contact{contactsList.filter(c => c.netBalance < 0).length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[var(--negative-bg)] text-[var(--negative)] flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <FaArrowUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: CUSTOMER NAME TILES OVERVIEW (Shown when no contact is selected) */}
      {!selectedPersonKey ? (
        <div className="space-y-4 pb-6">
          {/* Header Controls & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--surface-1)] p-4 rounded-2xl border border-[var(--border)] shadow-[var(--shadow-3d)]">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search contact name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={FaSearch}
                className="w-full text-xs"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
              {[
                { id: 'all', label: 'All Contacts' },
                { id: 'get', label: 'You Get' },
                { id: 'give', label: 'You Give' },
                { id: 'settled', label: 'Settled' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[var(--brand)] text-white shadow-xs'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={() => openNewTransaction('lent', '')}
              icon={FaPlus}
              className="font-bold text-xs h-10 w-full sm:w-auto"
            >
              Add New Contact
            </Button>
          </div>

          {/* Customer Name Tiles Grid */}
          {contactsList.length === 0 ? (
            <Card className="p-8 text-center bg-[var(--surface-1)] shadow-[var(--shadow-3d)]">
              <EmptyState
                title="No Contact Tiles Found"
                description="Start by adding your first customer or friend transaction."
                actionLabel="Add Customer Record"
                onAction={() => openNewTransaction('lent')}
                icon={FaUser}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactsList.map((contact) => {
                const isGet = contact.netBalance > 0;
                const isGive = contact.netBalance < 0;

                return (
                  <div
                    key={contact.key}
                    onClick={() => setSelectedPersonKey(contact.key)}
                    className="tactile-card rounded-2xl p-4.5 bg-[var(--surface-1)] border border-[var(--border)] shadow-[var(--shadow-3d)] hover:shadow-[var(--shadow-3d-hover)] hover:border-[var(--brand)]/40 transition-all cursor-pointer space-y-3.5 group flex flex-col justify-between"
                  >
                    {/* Top Row: Avatar + Name on Left, Prominent Net Balance on Right */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-2xl bg-[var(--brand-light)] text-[var(--brand)] font-black text-base flex items-center justify-center shrink-0 border border-[var(--brand)]/20 shadow-xs group-hover:scale-105 transition-transform">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors truncate">
                            {contact.name}
                          </h3>
                          <span className="text-[11px] text-[var(--text-muted)] font-medium block truncate">
                            {contact.transactions.length} entry • {formatOkCreditDate(contact.lastDate)}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Net Result on the Top Right */}
                      <div className="text-right shrink-0">
                        <span
                          className={`text-lg sm:text-xl font-black tabular-nums block leading-tight ${
                            isGet
                              ? 'text-[var(--positive)]'
                              : isGive
                              ? 'text-[var(--negative)]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {isGet
                            ? `+${formatMoney(contact.netBalance)}`
                            : isGive
                            ? `-${formatMoney(Math.abs(contact.netBalance))}`
                            : '₹0'}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider block ${
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

                    {/* Bottom Strip: Sleek Gave vs Took breakdown with hover arrow */}
                    <div className="pt-2.5 border-t border-[var(--border)]/60 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <div className="flex items-center gap-3 font-medium text-[11px]">
                        <span>
                          Gave: <strong className="text-[var(--negative)] font-bold">{formatMoney(contact.lentTotal)}</strong>
                        </span>
                        <span className="text-[var(--border-strong)]">•</span>
                        <span>
                          Took: <strong className="text-[var(--positive)] font-bold">{formatMoney(contact.borrowedTotal)}</strong>
                        </span>
                      </div>

                      <span className="text-[11px] font-bold text-[var(--brand)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View <span className="text-sm">→</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: CUSTOMER DETAIL TRANSACTION SCREEN (STRICT 3-COMPONENT FIXED LAYOUT) */
        <div className="tactile-card rounded-2xl overflow-hidden shadow-[var(--shadow-3d)] bg-[var(--surface-1)] border border-[var(--border)] flex flex-col h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-7.5rem)] relative">
          {/* COMPONENT 1: FIXED HEADER (EXACTLY 5 ITEMS: BACK ARROW, AVATAR, NAME, FILE ICON, REMIND BUTTON) */}
          <div className="p-3.5 px-4 border-b border-[var(--border)] bg-[var(--surface-1)] shrink-0 z-10 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* 1. Back Arrow Button */}
              <button
                onClick={handleBackToContacts}
                className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border)] flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Back to contacts list"
                title="Back to All Contacts"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {/* 2. Avatar Circle */}
              <div className="w-10 h-10 rounded-full bg-[var(--brand)] text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                {(activeContact?.name || 'C').charAt(0).toUpperCase()}
              </div>

              {/* 3. Contact Name */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] leading-snug truncate">
                  {activeContact?.name || 'Customer Account'}
                </h3>
              </div>
            </div>

            {/* Items 4 & 5: File Icon & Remind Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* 4. Statement Report File Icon */}
              <button
                onClick={() => setIsStatementOpen(true)}
                className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center cursor-pointer"
                title="Account Statement Report"
              >
                <FaFileAlt className="w-4 h-4 text-[var(--brand)]" />
              </button>

              {/* 5. Remind Button */}
              <button
                onClick={handleWhatsAppRemind}
                className="px-4 py-2 rounded-xl bg-[var(--positive)] text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FaShareAlt className="w-3 h-3" />
                <span>Remind</span>
              </button>
            </div>
          </div>

          {/* COMPONENT 2: TRANSACTIONS TIMELINE (THE ONLY SCROLLABLE ELEMENT ON THE SCREEN) */}
          <div
            ref={transactionsContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-[var(--bg-page)]/40 min-h-0 overscroll-contain"
          >
            {groupedChatTransactions.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                {/* Date Divider Badge */}
                <div className="flex justify-center">
                  <span className="text-xs font-bold bg-[var(--surface-2)] text-[var(--text-secondary)] px-4 py-1 rounded-full border border-[var(--border)] shadow-xs">
                    {group.dateLabel}
                  </span>
                </div>

                {/* Transaction Cards: LEFT = TAKE / GOT, RIGHT = GIVE / GAVE */}
                {group.items.map((tx) => {
                  const isLent = tx.parsedIsLent; // true = GIVE (Right), false = TAKE (Left)

                  return (
                    <div
                      key={tx._id}
                      className={`flex flex-col ${
                        isLent ? 'items-end' : 'items-start'
                      } space-y-1 animate-fadeIn`}
                    >
                      {/* Modern Clean Bubble Card - Tap / Click to Edit on Mobile & Desktop */}
                      <div
                        onClick={() => openEditTransaction(tx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openEditTransaction(tx);
                          }
                        }}
                        className={`p-3 px-4 rounded-2xl shadow-xs border max-w-[85%] sm:max-w-[65%] min-w-[160px] relative group transition-all cursor-pointer active:scale-[0.99] select-none hover:shadow-md ${
                          isLent
                            ? 'bg-[var(--surface-1)] border-rose-200 dark:border-rose-900/40 text-[var(--text-primary)] rounded-tr-xs hover:border-rose-400/60'
                            : 'bg-[var(--surface-1)] border-emerald-200 dark:border-emerald-900/40 text-[var(--text-primary)] rounded-tl-xs hover:border-emerald-400/60'
                        }`}
                        title="Click to view details or edit"
                      >
                        {/* Main Content Row: Arrow + Amount, Time + Status */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5">
                            {isLent ? (
                              <FaArrowUp className="w-3.5 h-3.5 text-[var(--negative)] shrink-0" />
                            ) : (
                              <FaArrowDown className="w-3.5 h-3.5 text-[var(--positive)] shrink-0" />
                            )}
                            <span
                              className={`text-lg sm:text-xl font-black tabular-nums tracking-tight ${
                                isLent ? 'text-[var(--negative)]' : 'text-[var(--positive)]'
                              }`}
                            >
                              {formatMoney(tx.amount)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] shrink-0">
                            <span>{formatTimeOnly(tx.createdAt || tx.date)}</span>
                            <FaCheck className="w-2.5 h-2.5 text-[var(--positive)] opacity-80" />
                          </div>
                        </div>

                        {/* Note / Remarks Description */}
                        {tx.parsedNote && (
                          <p className="text-xs text-[var(--text-secondary)] font-medium pt-1.5 mt-1 border-t border-[var(--border)]/40 leading-relaxed">
                            {tx.parsedNote}
                          </p>
                        )}

                        {/* Floating Action Controls on Hover (Desktop Quick Access) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 right-2 flex items-center gap-1 bg-[var(--surface-1)] border border-[var(--border)] shadow-md rounded-lg p-0.5 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditTransaction(tx);
                            }}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] rounded transition-colors cursor-pointer"
                            title="Edit Entry"
                          >
                            <FaEdit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecord(tx);
                            }}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--negative)] hover:bg-[var(--surface-2)] rounded transition-colors cursor-pointer"
                            title="Delete Entry"
                          >
                            <FaTrashAlt className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Cumulative Running Balance Subtext */}
                      <span className="text-[11px] font-bold text-[var(--text-primary)] px-1 tracking-wide">
                        {tx.runningBalanceText}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* COMPONENT 3: SINGLE FLOATING ACTION BUTTON (STATIONARY AT BOTTOM RIGHT) */}
          <button
            onClick={() => openNewTransaction('lent', activeContact?.name || '')}
            className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white shadow-[var(--shadow-floating)] rounded-full px-5 py-3.5 flex items-center gap-2 font-bold text-xs sm:text-sm z-30 transition-all hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
            title="Add Transaction"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      )}

      {/* Account Statement Drawer Modal */}
      {isStatementOpen && activeContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--surface-1)] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]/50">
              <div>
                <h3 className="font-bold text-lg text-[var(--text-primary)]">
                  Account Statement - {activeContact.name}
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  Total Entries: {activeContact.transactions.length}
                </span>
              </div>
              <button
                onClick={() => setIsStatementOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
              <div className="grid grid-cols-4 font-bold border-b border-[var(--border)] pb-2 text-[var(--text-secondary)]">
                <span>Date</span>
                <span>Type</span>
                <span>Amount</span>
                <span className="text-right">Running Balance</span>
              </div>

              {activeContact.transactions.map((tx) => (
                <div key={tx._id} className="grid grid-cols-4 py-1.5 border-b border-[var(--border)]/30 text-[var(--text-primary)]">
                  <span>{formatOkCreditDate(tx.date || tx.createdAt)}</span>
                  <span className={tx.parsedIsLent ? 'text-[var(--negative)] font-bold' : 'text-[var(--positive)] font-bold'}>
                    {tx.parsedIsLent ? 'GIVE' : 'TAKE'}
                  </span>
                  <span>{formatMoney(tx.amount)}</span>
                  <span className="text-right font-bold">{tx.runningBalanceText}</span>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[var(--border)] flex justify-end gap-2 bg-[var(--surface-2)]/50">
              <Button size="sm" variant="secondary" onClick={() => setIsStatementOpen(false)}>
                Close
              </Button>
              <Button size="sm" variant="primary" onClick={() => window.print()}>
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Add / Edit Lend & Borrow Modal */}
      <AddLendBorrowModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRecordToEdit(null);
        }}
        initialType={modalType}
        initialPersonName={modalPersonName}
        recordToEdit={recordToEdit}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
};

export default LendBorrowContainer;
