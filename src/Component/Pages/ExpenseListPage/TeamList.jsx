import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllGroup, deleteGroup } from '../../../redux/groupSlice';
import { getExpenses } from '../../../redux/expenseSlice';
import { formatMoney } from '../../../helpers/formatters';
import { calculateUserBalances } from '../../../helpers/balanceCalculator';
import Card from '../../Common/Primitives/Card';
import Button from '../../Common/Primitives/Button';
import Badge from '../../Common/Primitives/Badge';
import EmptyState from '../../Common/Primitives/EmptyState';
import AddTeam from '../../Common/AddTeam/AddTeam';
import Invite from '../../Common/Invite/Invite';
import AddExpenseModal from './AddExpenseModal';
import SettleUpModal from './SettleUpModal';
import { FaPlus, FaUsers, FaUserPlus, FaEllipsisV, FaTrashAlt, FaPen, FaCalendarAlt } from 'react-icons/fa';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = [2024, 2025, 2026, 2027];

export const TeamList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { groups = [], groupLoading } = useSelector((state) => state.group);
  const { groupExpenses = {} } = useSelector((state) => state.expense);

  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [openInviteGroup, setOpenInviteGroup] = useState(null);
  const [openAddExpenseGroup, setOpenAddExpenseGroup] = useState(null);
  const [openSettleGroup, setOpenSettleGroup] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletableGroup, setDeletableGroup] = useState(null);

  // Month & Year Selector state (defaulting to current month/year)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getAllGroup());
  }, [dispatch]);

  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((g) => dispatch(getExpenses(g._id)));
    }
  }, [dispatch, groups]);

  const { groupBalancesMap } = calculateUserBalances(
    groups,
    groupExpenses,
    [],
    user?._id,
    selectedMonth,
    selectedYear
  );

  const handleDelete = async (group) => {
    if (window.confirm(`Delete '${group.groupName}'? This can't be undone.`)) {
      await dispatch(deleteGroup(group._id));
      setDeletableGroup(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            Groups
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] truncate">
            Manage your shared expenses and team split balances
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Month & Year Selection Bar */}
          <div className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)] shadow-sm">
            <FaCalendarAlt className="text-[var(--brand)] w-3.5 h-3.5 ml-2 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-[var(--text-primary)] py-1.5 px-2 focus:outline-none cursor-pointer"
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
              className="bg-transparent text-xs font-semibold text-[var(--text-primary)] py-1.5 px-2 focus:outline-none cursor-pointer border-l border-[var(--border)]"
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
            variant="primary"
            size="sm"
            onClick={() => setOpenAddGroup(true)}
            icon={FaPlus}
            className="shrink-0 whitespace-nowrap h-10"
          >
            Create group
          </Button>
        </div>
      </div>

      {groups.length === 0 && !groupLoading ? (
        <EmptyState
          title="Track your first group expense"
          description="Create a group for trips, rent, or shared dinners to easily split expenses."
          actionLabel="Create group"
          onAction={() => setOpenAddGroup(true)}
          icon={FaUsers}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => {
            const gData = groupBalancesMap[group._id] || { netBalance: 0, memberBalances: [] };
            const net = gData.netBalance;

            return (
              <Card
                key={group._id}
                interactive
                onClick={() => navigate(`/group-expense/${group._id}`)}
                className="flex flex-col justify-between p-5 md:p-6 shadow-[var(--shadow-3d)]"
              >
                <div>
                  {/* Top Title Bar & Overflow Menu */}
                  <div className="flex items-start justify-between gap-2 pb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors truncate">
                        {group.groupName}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                        {group.description || 'No description'}
                      </p>
                    </div>

                    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === group._id ? null : group._id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
                        aria-label="Group options"
                      >
                        <FaEllipsisV className="w-3.5 h-3.5" />
                      </button>

                      {openMenuId === group._id && (
                        <div className="absolute right-0 mt-1 w-44 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl shadow-lg py-1 z-30">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setOpenInviteGroup(group);
                            }}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)] flex items-center gap-2"
                          >
                            <FaUserPlus className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />
                            <span>Invite member</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(group);
                            }}
                            className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-[var(--negative)] hover:bg-[var(--negative-bg)] flex items-center gap-2"
                          >
                            <FaTrashAlt className="w-3.5 h-3.5 shrink-0" />
                            <span>Delete group</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Derived Net Balance Banner - Spacious margin before and after */}
                  <div className="my-1 p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-2 shadow-sm">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      Your position
                    </span>
                    <Badge variant={net > 0 ? 'positive' : net < 0 ? 'negative' : 'neutral'}>
                      {net > 0
                        ? `You will get ${formatMoney(net)}`
                        : net < 0
                          ? `You have to give ${formatMoney(Math.abs(net))}`
                          : 'All clear'}
                    </Badge>
                  </div>

                  {/* Per-Member Balance Breakdown List */}
                  <div className="mt-4 pt-1 space-y-2 text-xs">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                      Member balances
                    </span>
                    {gData.memberBalances.length === 0 ? (
                      <span className="text-[var(--text-muted)] italic block py-1">No active balance in group</span>
                    ) : (
                      <div className="space-y-1.5">
                        {gData.memberBalances.map((mb, i) => (
                          <div key={i} className="flex justify-between items-center py-1.5 border-b border-[var(--border)]/40 last:border-none">
                            <div>
                              <span className="font-medium text-[var(--text-primary)] block truncate max-w-[140px]">
                                {mb.member.firstName} {mb.member.lastName || ''}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)] block">
                                Spent in {MONTHS[selectedMonth]}: {formatMoney(mb.totalSpent)}
                              </span>
                            </div>
                            <span
                              className={`font-semibold tabular-nums shrink-0 ${mb.amount > 0 ? 'text-[var(--positive)]' : mb.amount < 0 ? 'text-[var(--negative)]' : 'text-[var(--text-muted)]'
                                }`}
                            >
                              {mb.amount > 0
                                ? `will get ${formatMoney(mb.amount)}`
                                : mb.amount < 0
                                  ? `has to give ${formatMoney(Math.abs(mb.amount))}`
                                  : 'All clear'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Spacious 2-row layout */}
                <div className="space-y-2 pt-4 mt-3 border-t border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button
                      size="sm"
                      variant="secondary"
                      fullWidth
                      onClick={() => setOpenInviteGroup(group)}
                      icon={FaUserPlus}
                    >
                      Invite
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      fullWidth
                      onClick={() => setOpenSettleGroup(group._id)}
                    >
                      Settle up
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    fullWidth
                    onClick={() => setOpenAddExpenseGroup(group._id)}
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

      {/* Create Team Modal */}
      {openAddGroup && (
        <AddTeam user={user} onClose={() => setOpenAddGroup(false)} />
      )}

      {/* Invite Modal */}
      {openInviteGroup && (
        <Invite
          openInvite={Boolean(openInviteGroup)}
          handleClose={() => setOpenInviteGroup(null)}
          group={openInviteGroup}
        />
      )}

      {/* Add Expense Modal */}
      {openAddExpenseGroup && (
        <AddExpenseModal
          isOpen={Boolean(openAddExpenseGroup)}
          onClose={() => setOpenAddExpenseGroup(null)}
          defaultGroupId={openAddExpenseGroup}
        />
      )}

      {/* Settle Up Modal */}
      {openSettleGroup && (
        <SettleUpModal
          isOpen={Boolean(openSettleGroup)}
          onClose={() => setOpenSettleGroup(null)}
          groupId={openSettleGroup}
        />
      )}
    </div>
  );
};

export default TeamList;
