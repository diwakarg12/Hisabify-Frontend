import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartPie, FaReceipt, FaUsers, FaCog, FaPlus, FaUser } from 'react-icons/fa';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: FaChartPie, link: '/dashboard' },
  { name: 'Group expenses', icon: FaUsers, link: '/teamlist' },
  { name: 'Personal expenses', icon: FaReceipt, link: '/myexpense' },
  { name: 'Settings', icon: FaCog, link: '/setting' },
];

export const SideNav = ({ isMobile = false, onOpenAddExpense }) => {
  const location = useLocation();

  // Mobile Bottom Tab Bar (Section 8)
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--surface-1)] border-t border-[var(--border)] z-40 flex items-center justify-around px-2 shadow-[var(--shadow-floating)]">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            location.pathname === '/dashboard' ? 'text-[var(--brand)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaChartPie className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </Link>

        <Link
          to="/teamlist"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            location.pathname === '/teamlist' ? 'text-[var(--brand)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaUsers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Groups</span>
        </Link>

        {/* Center Prominent Add Expense FAB */}
        <button
          onClick={onOpenAddExpense}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#269685] to-[#176054] text-white flex items-center justify-center shadow-[0_6px_14px_rgba(31,122,108,0.5)] border border-teal-700 -translate-y-3 active:scale-95 transition-transform"
          aria-label="Add expense"
        >
          <FaPlus className="w-5 h-5" />
        </button>

        <Link
          to="/myexpense"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            location.pathname === '/myexpense' ? 'text-[var(--brand)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaReceipt className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Expenses</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            location.pathname === '/profile' ? 'text-[var(--brand)] font-bold' : 'text-[var(--text-secondary)]'
          }`}
        >
          <FaUser className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </Link>
      </nav>
    );
  }

  // Desktop Neutral Sidebar
  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-[var(--surface-1)] border-r border-[var(--border)] flex flex-col p-3 gap-1 shrink-0">
      <div className="flex-1 space-y-1 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.link;
          return (
            <Link
              key={item.link}
              to={item.link}
              className={`
                flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150
                ${
                  isActive
                    ? 'bg-[var(--brand-light)] text-[var(--brand)] border border-[var(--brand)]/20 shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)]'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Quick Add Expense Button */}
      <div className="pt-3 border-t border-[var(--border)]">
        <button
          onClick={onOpenAddExpense}
          className="tactile-btn tactile-btn-primary w-full flex items-center justify-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add expense</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
